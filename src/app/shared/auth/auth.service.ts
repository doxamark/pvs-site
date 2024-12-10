import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken'; // Key for storing the token in localStorage

  constructor() {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Save JWT token to localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Remove token from localStorage
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

}
