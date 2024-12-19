import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
  })
export class ClientService {
    private apiUrl = 'http://localhost:3000/api'; // Your API base URL
    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
          map(response => response)
        );
      }
      
      getClientInformation(): Observable<any> {
        return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/client`).pipe(
          map(response => response)
        );
      }

}
