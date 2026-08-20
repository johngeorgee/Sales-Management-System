import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICategories } from '../../../../core/Models/categories';
import { IDepartments } from '../../../../core/Models/departments';
import { DepartmentService } from '../../../../core/services/departments';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-dialog.html'
})
export class CategoryDialog implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() category: ICategories | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ICategories>();

  departments: IDepartments[] = [];
  formData: any = {
    Category_Name: '',
    Category_Id: null,
    departmentRef: ''
  };
  isSaving = false;
  errorMessage = '';

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category) {
      this.fillForm();
    }
    if (changes['mode']) {
      this.errorMessage = '';
      this.isSaving = false;
    }
  }

  fillForm(): void {
    if (!this.category) return;

    if (this.mode === 'edit' || this.mode === 'view') {
      this.formData = {
        Category_Name: this.category.Category_Name || '',
        Category_Id: this.category.Category_Id || null,
        departmentRef: this.category.departmentRef?._id || ''
      };
    }
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data || [];
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      }
    });
  }

  close() {
    this.closed.emit();
  }

  save() {
    if (!this.formData.Category_Name || !this.formData.Category_Name.trim()) {
      this.errorMessage = 'Category name is required';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const categoryData: ICategories = {
      ...this.formData,
      _id: this.category?._id || '',
      Category_Name: this.formData.Category_Name.trim(),
      Category_Id: Number(this.formData.Category_Id) || 0
    };

    this.saved.emit(categoryData);
    this.isSaving = false;
    this.close();
  }

  // Helper method to reset form for add mode
  resetForm(): void {
    this.formData = {
      Category_Name: '',
      Category_Id: null,
      departmentRef: ''
    };
    this.errorMessage = '';
  }
}