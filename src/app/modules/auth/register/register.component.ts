import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-form">
      <div class="form-header">
        <h2>Créer un compte</h2>
        <p>Rejoignez LocalMarket et découvrez les trésors du Burkina Faso</p>
      </div>

      <!-- Role Selection -->
      <div class="role-selection">
        <label class="role-option" [class.selected]="registerForm.get('role')?.value === 'customer'">
          <input type="radio" formControlName="role" value="customer" (change)="onRoleChange()">
          <div class="role-content">
            <mat-icon>shopping_bag</mat-icon>
            <span>Je veux acheter</span>
          </div>
        </label>
        <label class="role-option" [class.selected]="registerForm.get('role')?.value === 'vendor'">
          <input type="radio" formControlName="role" value="vendor" (change)="onRoleChange()">
          <div class="role-content">
            <mat-icon>store</mat-icon>
            <span>Je veux vendre</span>
          </div>
        </label>
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        
        <div class="form-row">
          <div class="form-group">
            <label>Prénom</label>
            <input type="text" formControlName="firstName" placeholder="Moussa" class="form-input">
            <div class="error-message" *ngIf="registerForm.get('firstName')?.touched && registerForm.get('firstName')?.hasError('required')">
              Requis
            </div>
          </div>

          <div class="form-group">
            <label>Nom</label>
            <input type="text" formControlName="lastName" placeholder="Kaboré" class="form-input">
            <div class="error-message" *ngIf="registerForm.get('lastName')?.touched && registerForm.get('lastName')?.hasError('required')">
              Requis
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Téléphone</label>
          <div class="phone-input">
            <span class="phone-prefix">+226</span>
            <input type="tel" formControlName="phone" placeholder="70 00 00 00" class="form-input">
          </div>
          <div class="error-message" *ngIf="registerForm.get('phone')?.touched && registerForm.get('phone')?.hasError('required')">
            Requis
          </div>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="exemple@email.bf" class="form-input">
          <div class="error-message" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.hasError('required')">
            L'email est requis
          </div>
          <div class="error-message" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.hasError('email')">
            Email invalide
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Mot de passe</label>
            <div class="password-input">
              <input [type]="hidePassword ? 'password' : 'text'" formControlName="password" class="form-input">
              <button type="button" class="password-toggle" (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.hasError('required')">
              Requis
            </div>
            <div class="error-message" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.hasError('minlength')">
              6 caractères min.
            </div>
          </div>

          <div class="form-group">
            <label>Confirmer</label>
            <input [type]="hidePassword ? 'password' : 'text'" formControlName="confirmPassword" class="form-input">
            <div class="error-message" *ngIf="registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched">
              Les mots de passe ne correspondent pas
            </div>
          </div>
        </div>

        <!-- Vendor Fields -->
        <div *ngIf="isVendorSelected" class="vendor-section">
          <h3>Informations vendeur</h3>
          
          <div class="form-group">
            <label>Nom de la boutique</label>
            <input type="text" formControlName="shopName" placeholder="Ma Boutique" class="form-input">
            <div class="error-message" *ngIf="registerForm.get('shopName')?.touched && registerForm.get('shopName')?.hasError('required')">
              Requis
            </div>
          </div>

          <div class="form-group">
            <label>Numéro CNIB / NINEA</label>
            <input type="text" formControlName="taxId" placeholder="B12345678" class="form-input">
            <div class="error-message" *ngIf="registerForm.get('taxId')?.touched && registerForm.get('taxId')?.hasError('required')">
              Requis
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading">
          <span *ngIf="!isLoading">Créer mon compte</span>
          <mat-spinner *ngIf="isLoading" diameter="20" color="accent"></mat-spinner>
        </button>

      </form>

      <div class="login-link">
        <p>Vous avez déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
      </div>
    </div>
  `,
  styles: [`
    .register-form {
      width: 100%;
    }

    .form-header {
      margin-bottom: 1.5rem;
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

    .role-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .role-option {
      position: relative;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .role-option input[type="radio"] {
      position: absolute;
      opacity: 0;
    }

    .role-option.selected {
      border-color: #10b981;
      background: #f0fdf4;
    }

    .role-option:hover {
      border-color: #10b981;
    }

    .role-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }

    .role-content mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #10b981;
    }

    .role-content span {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
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

    .phone-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .phone-prefix {
      padding: 0.875rem 1rem;
      background: #f3f4f6;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-weight: 600;
      color: #374151;
      white-space: nowrap;
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

    .vendor-section {
      background: #fef3c7;
      border: 2px dashed #f59e0b;
      border-radius: 8px;
      padding: 1rem;
      margin-top: 0.5rem;
    }

    .vendor-section h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #92400e;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .login-link p {
      color: #6b7280;
      margin: 0;
      font-size: 0.95rem;
    }

    .login-link a {
      color: #10b981;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  isVendorSelected = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.group({
      role: ['customer', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      shopName: [''],
      taxId: ['']
    }, { validators: this.passwordMatchValidator });
  }

  onRoleChange() {
    this.isVendorSelected = this.registerForm.get('role')?.value === 'vendor';
    const shopNameControl = this.registerForm.get('shopName');
    const taxIdControl = this.registerForm.get('taxId');

    if (this.isVendorSelected) {
      shopNameControl?.setValidators([Validators.required]);
      taxIdControl?.setValidators([Validators.required]);
    } else {
      shopNameControl?.clearValidators();
      taxIdControl?.clearValidators();
    }
    shopNameControl?.updateValueAndValidity();
    taxIdControl?.updateValueAndValidity();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { confirmPassword, shopName, taxId, ...data } = this.registerForm.value;

      this.authService.register(data).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.notification.error('Erreur lors de l\'inscription. Email peut-être déjà utilisé.');
        }
      });
    }
  }
}
