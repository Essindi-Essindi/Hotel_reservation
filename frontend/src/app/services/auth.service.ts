import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.ApiUrl; // Adjust to your backend URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Sign in method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap((response: any) => {
        // Assuming the backend returns a token in the response
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem("username", response.username);
          localStorage.setItem("password", response.password);
          localStorage.setItem("name", response.name);
          localStorage.setItem("email", response.email);
          localStorage.setItem("telephone", response.phone);
          localStorage.setItem("userId", response.id);
          console.log(response)
        }
      }),
      catchError(this.handleError)
    );
  }

  // Sign up method
  register(userData: { name: string; username: string; email: string; phone?: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData).pipe(
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
