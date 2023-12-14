import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeServiceService {
  private apiUrl = 'http://localhost:33070/toy/random/aleatory';

  constructor(private http: HttpClient) {}

  getRandomToys(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
