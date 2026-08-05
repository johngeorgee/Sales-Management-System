
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.css',
})
export class CategoryDialog {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add'|'edit'|'view', category: any }
  ) {}
}
