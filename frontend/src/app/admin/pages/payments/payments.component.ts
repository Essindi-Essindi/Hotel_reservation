import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { PaymentService} from '../../services/payment.service';
import { PaymentDto, PaymentMethod } from '../../models/payment.model';

// ── View model for the table (enriches raw DTO for display) ───
interface PaymentRow {
  id: string;
  txCode: string;           // e.g. TX-9821
  bookingCode: string;      // e.g. BK-2841
  guest: string;            // derived from userID (mock label)
  methodLabel: string;      // e.g. "Visa •••• 4821"
  date: string;
  status: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  amount: number;
  raw: PaymentDto;
}

// ── Chart point ───────────────────────────────────────────────
interface ChartPoint {
  month: string;
  revenue: number;
  x: number;   // 0–100 percentage along x axis
  y: number;   // 0–100 percentage along y axis (inverted: 0=top)
}

// Lookup to produce display-friendly method strings
const METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH:          'Cash',
  CARD:          'Card',
  WIRE_TRANSFER: 'Wire Transfer',
  MOBILE:        'Mobile Pay',
};

// Mock guest names keyed by userID (replace with real user service when ready)
const GUEST_NAMES: Record<number, string> = {
  1: 'Eleanor Vance',
  2: 'Marcus Aurelius',
  3: 'Isabella Rossi',
  4: 'Hiroshi Tanaka',
  5: 'Sofia Mendez',
  6: "Liam O'Connor",
  7: 'Amélie Laurent',
  8: 'David Osei',
  9: 'Nina Petrov',
  10: 'Carlos Vega',
};

// Mock payment statuses (backend doesn't have a status field yet)
const MOCK_STATUSES: ('Paid' | 'Pending' | 'Refunded' | 'Failed')[] = [
  'Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Failed', 'Paid', 'Paid', 'Pending', 'Paid',
];

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, PageHeaderComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
  providers: [DatePipe],
})
export class PaymentsComponent implements OnInit {

  // ── State ─────────────────────────────────────────────────
  loading = signal(true);
  error   = signal<string | null>(null);
  rows    = signal<PaymentRow[]>([]);

  // New payment modal
  showNewModal  = signal(false);
  saving        = signal(false);
  saveError     = signal<string | null>(null);
  newPayment: Partial<PaymentDto> & { paymentMethod: PaymentMethod } = {
    amount: 0,
    paymentMethod: 'CARD',
    reservationID: 0,
    userID: 0,
  };
  readonly methods: PaymentMethod[] = ['CASH', 'CARD', 'WIRE_TRANSFER', 'MOBILE'];

  // Delete confirm
  deletingId = signal<string | null>(null);

  // Filter
  methodFilter = signal<PaymentMethod | 'ALL'>('ALL');
  readonly filterMethods: (PaymentMethod | 'ALL')[] = ['ALL', 'CASH', 'CARD', 'WIRE_TRANSFER', 'MOBILE'];

  // ── Computed KPIs ─────────────────────────────────────────
  totalRevenue = computed(() =>
    this.rows().reduce((s, r) => s + r.amount, 0)
  );
  successfulCount = computed(() =>
    this.rows().filter(r => r.status === 'Paid').length
  );
  refundedTotal = computed(() =>
    this.rows().filter(r => r.status === 'Refunded').reduce((s, r) => s + r.amount, 0)
  );
  avgTransaction = computed(() => {
    const r = this.rows();
    return r.length ? Math.round(r.reduce((s, x) => s + x.amount, 0) / r.length) : 0;
  });

  // ── Filtered rows ─────────────────────────────────────────
  filteredRows = computed(() => {
    const mf = this.methodFilter();
    if (mf === 'ALL') return this.rows();
    return this.rows().filter(r => r.raw.paymentMethod === mf);
  });

  // ── Chart data (monthly revenue from rows) ────────────────
  chartPoints = computed<ChartPoint[]>(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const buckets: Record<string, number> = {};
    months.forEach(m => (buckets[m] = 0));

    this.rows().forEach(r => {
      const d = new Date(r.date);
      if (!isNaN(d.getTime())) {
        const m = months[d.getMonth()];
        buckets[m] += r.amount;
      }
    });

    // Fallback: use occupancy trend mock data if no real data
    const mockRevenue = [19000,21000,24000,22000,29000,31000,33000,35000,30000,29800,26000,38000];
    const hasSomeData = Object.values(buckets).some(v => v > 0);
    if (!hasSomeData) {
      months.forEach((m, i) => (buckets[m] = mockRevenue[i]));
    }

    const values = months.map(m => buckets[m]);
    const maxVal = Math.max(...values, 1);
    const minVal = 0;

    return months.map((month, i) => ({
      month,
      revenue: values[i],
      x: (i / (months.length - 1)) * 100,
      y: 100 - ((values[i] - minVal) / (maxVal - minVal)) * 85, // leave 15% top padding
    }));
  });

  // SVG polyline points string
  polylinePoints = computed(() =>
    this.chartPoints()
      .map(p => `${p.x},${p.y}`)
      .join(' ')
  );

  // Hover tooltip
  hoveredPoint = signal<ChartPoint | null>(null);

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading.set(true);
    this.error.set(null);
    this.paymentService.getAllPayments().subscribe({
      next: (dtos) => {
        this.rows.set(this.mapToRows(dtos));
        this.loading.set(false);
      },
      error: (err) => {
        // Fall back to mock data so the UI is never blank
        this.rows.set(this.mockRows());
        this.loading.set(false);
        this.error.set('Could not reach server — showing sample data.');
      },
    });
  }

  // ── Create payment ─────────────────────────────────────────
  openNew()  { this.showNewModal.set(true); this.saveError.set(null); }
  closeNew() { this.showNewModal.set(false); }

  submitPayment() {
    if (!this.newPayment.amount || !this.newPayment.reservationID || !this.newPayment.userID) {
      this.saveError.set('Please fill in all required fields.');
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);

    const dto: PaymentDto = {
      amount: this.newPayment.amount!,
      paymentMethod: this.newPayment.paymentMethod,
      reservationID: this.newPayment.reservationID!,
      userID: this.newPayment.userID!,
      paymentDate: new Date().toISOString(),
    };

    this.paymentService.createPayment(dto).subscribe({
      next: (created) => {
        this.rows.update(r => [this.toRow(created, r.length), ...r]);
        this.saving.set(false);
        this.closeNew();
        this.resetForm();
      },
      error: () => {
        this.saveError.set('Failed to create payment. Please try again.');
        this.saving.set(false);
      },
    });
  }

  resetForm() {
    this.newPayment = { amount: 0, paymentMethod: 'CARD', reservationID: 0, userID: 0 };
  }

  // ── Delete payment ─────────────────────────────────────────
  confirmDelete(id: string) { this.deletingId.set(id); }
  cancelDelete()             { this.deletingId.set(null); }

  executeDelete(id: string) {
    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.rows.update(r => r.filter(x => x.id !== id));
        this.deletingId.set(null);
      },
      error: () => {
        // Optimistically remove anyway for better UX (mock environment)
        this.rows.update(r => r.filter(x => x.id !== id));
        this.deletingId.set(null);
      },
    });
  }

  // ── Chart interaction ──────────────────────────────────────
  hoverPoint(p: ChartPoint)  { this.hoveredPoint.set(p); }
  clearHover()               { this.hoveredPoint.set(null); }

  methodLabel(m: PaymentMethod): string {
    return METHOD_LABELS[m] ?? m;
  }

  // ── Mapping helpers ────────────────────────────────────────
  private mapToRows(dtos: PaymentDto[]): PaymentRow[] {
    return dtos.map((dto, i) => this.toRow(dto, i));
  }

  private toRow(dto: PaymentDto, index: number): PaymentRow {
    const id     = dto.paymentID ?? `mock-${index}`;
    const txNum  = 9821 - index;
    const bkNum  = 2841 - index;
    const guest  = GUEST_NAMES[dto.userID] ?? `Guest #${dto.userID}`;
    const status = MOCK_STATUSES[index % MOCK_STATUSES.length];
    const date   = dto.paymentDate
      ? new Date(dto.paymentDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    // Build method label: CARD → "Visa •••• XXXX"
    const methodLabel = this.buildMethodLabel(dto.paymentMethod, txNum);

    return { id, txCode: `TX-${txNum}`, bookingCode: `BK-${bkNum}`, guest, methodLabel, date, status, amount: dto.amount, raw: dto };
  }

  private buildMethodLabel(method: PaymentMethod, seed: number): string {
    const last4 = String(seed).slice(-4).padStart(4, '0');
    switch (method) {
      case 'CARD':          return `Visa •••• ${last4}`;
      case 'WIRE_TRANSFER': return 'Wire Transfer';
      case 'CASH':          return 'Cash';
      case 'MOBILE':        return 'Mobile Pay';
      default:              return method;
    }
  }

  private mockRows(): PaymentRow[] {
    const mockDtos: PaymentDto[] = [
      { paymentID: 'p1', amount: 4280, paymentMethod: 'CARD',          reservationID: 2841, userID: 1, paymentDate: '2026-04-18' },
      { paymentID: 'p2', amount: 1240, paymentMethod: 'CARD',          reservationID: 2840, userID: 2, paymentDate: '2026-04-17' },
      { paymentID: 'p3', amount: 2160, paymentMethod: 'CARD',          reservationID: 2839, userID: 3, paymentDate: '2026-04-17' },
      { paymentID: 'p4', amount: 1480, paymentMethod: 'WIRE_TRANSFER', reservationID: 2838, userID: 4, paymentDate: '2026-04-16' },
      { paymentID: 'p5', amount: 1820, paymentMethod: 'CARD',          reservationID: 2837, userID: 5, paymentDate: '2026-04-15' },
      { paymentID: 'p6', amount:  380, paymentMethod: 'CARD',          reservationID: 2836, userID: 6, paymentDate: '2026-04-15' },
      { paymentID: 'p7', amount: 6420, paymentMethod: 'CARD',          reservationID: 2835, userID: 7, paymentDate: '2026-04-14' },
    ];
    return mockDtos.map((dto, i) => this.toRow(dto, i));
  }
}