import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  private apiUrl = 'http://localhost:3000/api/stats'; // Your API base URL

  constructor(private http: HttpClient) {}

  getClientSavings(): Observable<any> {
    return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/client-savings`).pipe(
      map(response => response.data)
    );
  }

  getClientTaxes(): Observable<any> {
    return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/client-taxes`).pipe(
      map(response => response.data)
    );
  }

  getClientValue(): Observable<any> {
    return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/client-value`).pipe(
      map(response => response.data)
    );
  }

  getTopAssessors(state: string): Observable<any> {
    return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/top-assessors?state=${state}`).pipe(
      map(response => response.data)
    );
  }

  getTaxesPerState(year: string): Observable<any> {
    return this.http.get<{ message: string, data: any }>(`${this.apiUrl}/taxes-per-state?year=${year}`).pipe(
      map(response => {
        // Transform the data as per the required logic
        return response.data.map(item => ({
          id: item.state_id,      // Set id to state_id
          name: item.state_name,  // Rename state_name to name
          value: item.tax_value,  // Rename tax_value to value
        }));
      })
    );
  }
  

  getUSStates(): Observable<any> {
    // Replace this with actual API if needed
    return this.http.get<{ data: any }>('assets/demo/data/us-states.json').pipe(
      map(response => response.data)
    );
  }
}
