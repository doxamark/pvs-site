import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService, private router: Router, private authService: AuthService,) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']); // Redirect to home page
    }
    
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Processing' });
      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Logging in, please Wait...', life: 3000 });
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error logging in. Please try again.', life: 3000 });
      this.authService.setToken("asdasdasdasd");
      this.router.navigate(['/']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return control && control.invalid && (control.dirty || control.touched);
  }
}
