import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../shared/auth/auth.service';
import { ClientService } from 'src/app/shared/service/client.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService, ClientService],
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService,
        private clientService: ClientService
    ) {
        if (this.authService.isLoggedIn()) {
          console.log("heyheyheyyy")
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

            // Call login service
            this.clientService.login(username, password).subscribe(
                (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Info',
                        detail: 'Logging in, please wait...',
                        life: 1000,
                    });
                    setTimeout(() => {
                        this.authService.setToken(data.token);
                        this.authService.setClientName(data.client_name);
                        this.router.navigate(['/']);
                    }, 1000);
                    // On success, save the token and navigate to the home page
                },
                (error) => {
                    // Handle login error
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error logging in. Please try again.',
                        life: 3000,
                    });
                }
            );
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.loginForm.get(fieldName);
        return control && control.invalid && (control.dirty || control.touched);
    }
}
