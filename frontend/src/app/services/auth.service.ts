import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private api = 'http://localhost:3000/api/auth'; // Node backend URL

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/login`, data);
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
