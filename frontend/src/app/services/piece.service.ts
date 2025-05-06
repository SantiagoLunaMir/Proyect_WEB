import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Piece {
  _id?: string;
  name: string;
  description: string;
  price?: number;      
  estimatedTime: string;
  technicianContact: string;
  images?: string[];
  createdAt?: string;

  /* NUEVO */
  isPublic?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PieceService {
  private api = 'http://localhost:3000/api/pieces';

  constructor(private http: HttpClient) {}

  /* CRUD básico --------------------------------------------------------- */

  getPieces(): Observable<Piece[]> {
    return this.http.get<Piece[]>(this.api);
  }

  getPiece(id: string): Observable<Piece> {
    return this.http.get<Piece>(`${this.api}/${id}`);
  }

  createPiece(data: FormData): Observable<Piece> {
    return this.http.post<Piece>(this.api, data);
  }

  updatePiece(id: string, data: FormData): Observable<Piece> {
    return this.http.put<Piece>(`${this.api}/${id}`, data);
  }

  deletePiece(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }

  /* NUEVO --------------------------------------------------------------- */
  /** Cambia el estado de visibilidad en el catálogo público */
  togglePublish(id: string, isPublic: boolean): Observable<{ message: string; isPublic: boolean }> {
    return this.http.patch<{ message: string; isPublic: boolean }>(
      `${this.api}/${id}/publish`,
      { isPublic }
    );
  }
}
