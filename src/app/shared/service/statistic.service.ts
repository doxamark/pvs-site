import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatisticService {
    constructor(private http: HttpClient) {}

    getClientStatistics(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-general-statistics.json').pipe(
            map(response => response.data)
        );
    }

    getClientSavings(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-savings.json').pipe(
            map(response => response.data)
        );
    }

    getClientTaxes(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-taxes.json').pipe(
            map(response => response.data)
        );
    }

    getClientValue(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-value.json').pipe(
            map(response => response.data)
        );
    }

    getClientTrends(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-stats-trends.json').pipe(
            map(response => response.data)
        );
    }

    getTopAssessors(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/top-assessors.json').pipe(
            map(response => response.data)
        );
    }

    getTaxesPerState(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-taxes-per-state.json').pipe(
            map(response => response.data)
        );
    }

}
