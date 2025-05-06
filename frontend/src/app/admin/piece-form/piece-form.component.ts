// frontend/src/app/admin/piece-form/piece-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Piece, PieceService } from '../../services/piece.service';

@Component({
  selector: 'app-piece-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './piece-form.component.html'
})
export class PieceFormComponent implements OnInit {
  form: Omit<Piece, '_id'|'images'|'createdAt'> = {
    name: '',
    description: '',
    estimatedTime: '',
    technicianContact: ''
  };
  existingImages: string[] = [];
  selectedFiles: File[] = [];
  editMode = false;
  id?: string;

  constructor(
    private svc: PieceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      if (p['id']) {
        this.editMode = true;
        this.id = p['id'];
        // <-- Aquí usamos `this.id!` para decir “confía, no es undefined”
        this.svc.getPiece(this.id!).subscribe(piece => {
          this.form = {
            name: piece.name,
            description: piece.description,
            estimatedTime: piece.estimatedTime,
            technicianContact: piece.technicianContact
          };
          this.existingImages = piece.images || [];
        });
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files).slice(0, 8);
    }
  }

  submit(): void {
    const data = new FormData();
    data.append('name', this.form.name);
    data.append('description', this.form.description);
    data.append('estimatedTime', this.form.estimatedTime);
    data.append('technicianContact', this.form.technicianContact);
    // agregar archivos
    this.selectedFiles.forEach(file => data.append('images', file));

    if (this.editMode && this.id) {
      this.svc.updatePiece(this.id, data).subscribe(() =>
        this.router.navigate(['/admin/pieces'])
      );
    } else {
      this.svc.createPiece(data).subscribe(() =>
        this.router.navigate(['/admin/pieces'])
      );
    }
  }
}