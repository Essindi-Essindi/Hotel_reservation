import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Adjust to your backend URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Sign in method
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming the backend returns a token in the response
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Sign up method
  register(userData: { name: string; username: string; email: string; phone?: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((response: any) => {
        // Optionally, if registration auto-logs in, save token
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}