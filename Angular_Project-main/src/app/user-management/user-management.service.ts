// user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = 'http://localhost:33070';

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all-users`);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  deleteSelectedUsers(userIds: string[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-selected-users`, {
      body: { users: userIds },
    });
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email`, data);
  }

  toggleUserStatus(userId: string, status: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/user-status`, { userId, status });
  }
}
