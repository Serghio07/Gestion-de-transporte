import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { AuthUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, SessionInfo, VerifyPhoneRequest } from './auth.models';

const TOKEN_KEY = 'st_access_token';
const USER_KEY = 'st_auth_user';
const SESSION_KEY = 'st_session_id';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', payload, { withCredentials: true }).pipe(
      tap((response) => this.storeSession(response))
    );
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/register', payload, { withCredentials: true });
  }

  verifyPhone(payload: VerifyPhoneRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>('/api/auth/verify-code', payload, { withCredentials: true });
  }

  resendCode(telefono: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/resend-code', { telefono }, { withCredentials: true });
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}, { withCredentials: true }).subscribe({
      complete: () => this.clearSession()
    });
  }

  sessions(): Observable<{ success: boolean; data: SessionInfo[] }> {
    return this.http.get<{ success: boolean; data: SessionInfo[] }>('/api/auth/sessions', { withCredentials: true });
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private storeSession(response: LoginResponse): void {
    const { accessToken, user, sessionId } = response.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, sessionId);
    this.tokenSignal.set(accessToken);
    this.userSignal.set(user);
  }

  private readStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
