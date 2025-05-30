import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  department: string;
}

export interface Feedback {
  id?: number; // Opcional para criação
  title: string;
  message: string;
  type: number;
  employeeId: number;
  date: string;
  employee?: Employee; // Opcional, só para leitura
}

// Interface para o payload PascalCase do backend .NET
export interface FeedbackDto {
  Id: number;
  Title: string;
  Message: string;
  Type: number;
  EmployeeId: number;
  Date: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private apiUrl = '/api/Feedbacks';

  constructor(private http: HttpClient) {}

  getFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl);
  }

  // Aceita FeedbackDto para update (campos em PascalCase)
  updateFeedback(id: number, feedback: FeedbackDto): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${id}`, feedback);
  }

  addFeedback(feedback: Omit<Feedback, 'id' | 'employee'>): Observable<Feedback> {
    // Não envie id nem employee ao criar
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }
}