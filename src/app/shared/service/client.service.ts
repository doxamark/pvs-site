import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class StatisticService {
    constructor(private http: HttpClient) {}

    login(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-dummy-credentials.json').pipe(
            map(response => response.data)
        );
    }

    getClientInformation(): Observable<any> {
        // dummy data
        return this.http.get<{ data: any }>('assets/demo/data/client-dummy-information.json').pipe(
            map(response => response.data)
        );
    }

}
