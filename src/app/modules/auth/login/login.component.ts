import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  template: `
    <div class="login-form">
      <div class="form-header">
        <h2>Bienvenue de retour !</h2>
        <p>Connectez-vous pour accéder à votre compte</p>
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        
        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            formControlName="email" 
            placeholder="Entrez votre email"
            class="form-input"
          >
          <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('required')">
            L'email est requis
          </div>
          <div class="error-message" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.hasError('email')">
            Email invalide
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Mot de passe</label>
          <div class="password-input">
            <input 
              [type]="hidePassword ? 'password' : 'text'" 
              formControlName="password" 
              placeholder="Entrez votre mot de passe"
              class="form-input"
            >
            <button type="button" class="password-toggle" (click)="hidePassword = !hidePassword">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
          </div>
          <div class="error-message" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')">
            Le mot de passe est requis
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="rememberMe">
            <span>Se souvenir de moi</span>
          </label>
          <a routerLink="/auth/forgot-password" class="forgot-link">
            Mot de passe oublié ?
          </a>
        </div>

        <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
          <span *ngIf="!isLoading">Connexion - Continuer l'exploration</span>
          <mat-spinner *ngIf="isLoading" diameter="20" color="accent"></mat-spinner>
        </button>

        <!-- Quick Login Demo -->
        <div class="quick-login">
          <p class="quick-title">Connexion rapide (Démo)</p>
          <div class="quick-buttons">
            <button type="button" (click)="quickLogin('admin')" class="quick-btn">Admin</button>
            <button type="button" (click)="quickLogin('vendor')" class="quick-btn">Vendeur</button>
            <button type="button" (click)="quickLogin('customer')" class="quick-btn">Client</button>
          </div>
        </div>

      </form>

      <div class="divider">
        <span>Ou</span>
      </div>

      <div class="social-login">
        <button class="social-btn google-btn">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          <span>Se connecter avec Google</span>
        </button>
        <button class="social-btn apple-btn">
          <mat-icon>apple</mat-icon>
          <span>Se connecter avec Apple</span>
        </button>
        <button class="social-btn facebook-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Se connecter avec Facebook</span>
        </button>
      </div>

      <div class="register-link">
        <p>Nouveau sur LocalMarket ? <a routerLink="/auth/register">Créer un compte</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-form {
      width: 100%;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .form-header p {
      color: #6b7280;
      margin: 0;
      font-size: 0.95rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #10b981;
      background: white;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-input::placeholder {
      color: #9ca3af;
    }

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .password-toggle mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: -0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 400;
      color: #374151;
      font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #10b981;
    }

    .forgot-link {
      color: #10b981;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-link:hover {
      color: #059669;
      text-decoration: underline;
    }

    .submit-btn {
      width: 100%;
      padding: 1rem;
      background: #1f2937;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
      background: #111827;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .quick-login {
      background: #f0fdf4;
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 0.5rem;
    }

    .quick-title {
      font-size: 0.85rem;
      color: #059669;
      font-weight: 600;
      text-align: center;
      margin: 0 0 0.75rem 0;
    }

    .quick-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .quick-btn {
      padding: 0.5rem;
      background: white;
      border: 1px solid #10b981;
      border-radius: 6px;
      color: #059669;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .quick-btn:hover {
      background: #10b981;
      color: white;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      color: #9ca3af;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .social-login {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .social-btn:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }

    .google-btn {
      color: #3c4043;
    }

    .apple-btn {
      color: #000;
    }

    .apple-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .facebook-btn {
      color: #1877F2;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .register-link p {
      color: #6b7280;
      margin: 0;
      font-size: 0.95rem;
    }

    .register-link a {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.notification.error('Email ou mot de passe incorrect');
        }
      });
    }
  }

  quickLogin(role: 'admin' | 'vendor' | 'customer') {
    const credentials = {
      admin: { email: 'admin@example.com', password: 'admin123' },
      vendor: { email: 'vendor@example.com', password: 'vendor123' },
      customer: { email: 'customer@example.com', password: 'customer123' }
    };

    const creds = credentials[role];
    this.loginForm.patchValue(creds);
    this.onSubmit();
  }
}
