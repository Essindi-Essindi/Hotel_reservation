import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/admin-sidebar/sidebar.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminTopbarComponent } from './layout/admin-topbar/admin-topbar.component';


@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    SidebarComponent
  ]
})
export class AdminModule { }
