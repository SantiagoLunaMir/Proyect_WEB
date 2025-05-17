// frontend/src/app/services/work.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO que enviamos al back (solo IDs y campos primitivos)
export interface WorkRequest {
  pieceId: string;
  doctorId: string;
  productionTime?: string;  // Optional
  deliveryDate?: string;    // Optional
  cost?: number;            // Optional
  status: 'pendiente' | 'enProgreso' | 'completado';  // Required
}

// Modelo que recibimos del back (populate) con objetos anidados
export interface Work {
  _id?: string;
  pieceId: { _id: string; name: string };
  doctorId: { _id: string; name: string; address?: string };  // optional address
  technicianId?: string;
  deliveryDate?: string;
  productionTime?: string;
  cost?: number;
  status: 'pendiente' | 'enProgreso' | 'completado';  // optional here, but required for back
}

@Injectable({ providedIn: 'root' })
export class WorkService {
  private api = 'http://localhost:3000/api/works';
  constructor(private http: HttpClient) {}

  getWorks(): Observable<Work[]> {
    return this.http.get<Work[]>(this.api);
  }

  createWork(w: WorkRequest): Observable<Work> {
    return this.http.post<Work>(this.api, w);
  }

  updateWork(id: string, w: WorkRequest): Observable<Work> {
    return this.http.put<Work>(`${this.api}/${id}`, w);
  }

  deleteWork(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
  updateStatus(id: string, status: 'laborando' | 'hecho') {
    return this.http.patch<{ message:string; status:string }>(
      `${this.api}/${id}/status`,
      { status }
    );
  }
}
