import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent {
  feedbackForm: FormGroup;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.feedbackForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      type: [0, Validators.required],
      employeeId: [0, Validators.required],
      date: [new Date().toISOString(), Validators.required]
    });
  }

 onSubmit() {
  if (this.feedbackForm.valid) {
    // Pegue os valores do formulário
    const formValue = this.feedbackForm.value;

    // Monte o objeto do jeito que o backend espera
    const feedback = {
      title: formValue.title,
      message: formValue.message,
      type: Number(formValue.type), // ou String(formValue.type) se o backend espera string
      employeeId: Number(formValue.employeeId),
      date: formValue.date
    };

    this.feedbackService.addFeedback(feedback).subscribe({
      next: () => {
        this.success = 'Feedback enviado com sucesso!';
        this.error = '';
        this.feedbackForm.reset({ type: 0, date: new Date().toISOString() });
      },
      error: (err) => {
        // Mostre o erro detalhado se possível
        this.error = err?.error?.title || 'Erro ao enviar feedback.';
        this.success = '';
      }
    });
  }
}
}