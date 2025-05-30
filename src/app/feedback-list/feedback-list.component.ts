import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService, Feedback } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];
  loading = true;
  error = '';
  success = '';
  showModal = false;
  feedbackForm: FormGroup;
  feedbackEditando: Feedback | null = null;
  submitting = false;

  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      type: [0, Validators.required],
      employeeId: ['', Validators.required],
      date: ['']
    });
  }

  ngOnInit() {
    this.carregarFeedbacks();
  }

  carregarFeedbacks() {
    this.loading = true;
    this.feedbackService.getFeedbacks().subscribe({
      next: data => {
        this.feedbacks = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Erro ao carregar feedbacks';
        this.loading = false;
      }
    });
  }

  editarFeedback(feedback: Feedback) {
    this.showModal = true;
    this.success = '';
    this.error = '';
    this.feedbackEditando = feedback;

    // Preenche o formulário com os dados do feedback para edição
    this.feedbackForm.patchValue({
      title: feedback.title,
      message: feedback.message,
      type: feedback.type,
      employeeId: feedback.employeeId ?? feedback.employee?.id ?? '',
      date: feedback.date ? feedback.date.substring(0, 16) : ''
    });
  }

  fecharModal() {
    this.showModal = false;
    this.feedbackForm.reset({ type: 0 });
    this.feedbackEditando = null;
    this.success = '';
    this.error = '';
    this.submitting = false;
  }

  onSubmit() {
    if (
      this.feedbackForm.invalid ||
      !this.feedbackEditando ||
      this.feedbackEditando.id === undefined
    ) {
      return;
    }

    this.submitting = true;
    const formValue = this.feedbackForm.value;

    // Payload com campos em PascalCase para o backend C#
    const updatePayload = {
      Id: this.feedbackEditando.id,
      Title: formValue.title,
      Message: formValue.message,
      Type: formValue.type,
      EmployeeId: formValue.employeeId,
      Date: formValue.date
    };

    console.log('Payload enviado:', updatePayload);

    this.feedbackService.updateFeedback(this.feedbackEditando.id, updatePayload).subscribe({
      next: () => {
        this.success = 'Feedback atualizado com sucesso!';
        this.carregarFeedbacks();
        setTimeout(() => this.fecharModal(), 1000);
        this.submitting = false;
      },
      error: () => {
        this.error = 'Erro ao atualizar feedback.';
        this.submitting = false;
      }
    });
  }
}