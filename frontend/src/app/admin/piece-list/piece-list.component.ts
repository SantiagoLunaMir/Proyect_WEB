// frontend/src/app/admin/pieces/piece-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Piece, PieceService } from '../../services/piece.service';

@Component({
  selector: 'app-piece-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './piece-list.component.html',
  styleUrls: []
})
export class PieceListComponent implements OnInit {
  pieces: Piece[] = [];
  loading = false;

  constructor(
    private pieceSvc: PieceService,
    private router: Router
  ) {}

  /* ---------- ciclo de vida ---------- */
  ngOnInit(): void {
    this.loadPieces();
  }

  /* ---------- helpers ---------- */
  loadPieces(): void {
    this.loading = true;
    this.pieceSvc.getPieces().subscribe({
      next: data => (this.pieces = data),
      error: err => console.error('Error al cargar piezas:', err),
      complete: () => (this.loading = false)
    });
  }

  edit(id: string): void {
    this.router.navigate(['/admin/pieces/edit', id]);
  }

  delete(id: string): void {
    if (!confirm('¿Eliminar pieza?')) return;
    this.pieceSvc.deletePiece(id).subscribe(() => this.loadPieces());
  }

  /* ---------- NUEVO: toggle publicar ---------- */
  onTogglePublish(piece: Piece): void {
    const targetState = !piece.isPublic;
    this.pieceSvc.togglePublish(piece._id!, targetState).subscribe({
      next: () => (piece.isPublic = targetState),
      error: err => console.error(err)
    });
  }
}
