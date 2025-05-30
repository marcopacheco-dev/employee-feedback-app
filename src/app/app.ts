import { Component } from '@angular/core';
import { FeedbackListComponent } from './feedback-list/feedback-list.component'; // ajuste o caminho se necessário
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FeedbackListComponent, FeedbackFormComponent], // <-- Importa aqui!
  template: `<app-feedback-list></app-feedback-list>, <app-feedback-form></app-feedback-form>`
})
export class AppComponent {}