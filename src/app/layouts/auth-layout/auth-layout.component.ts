import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <!-- Left Side - Image/Branding -->
      <div class="auth-left">
        <div class="auth-overlay"></div>
        <div class="auth-content">
          <a routerLink="/" class="logo">
            <mat-icon>storefront</mat-icon>
            <span>LocalMarket.bf</span>
          </a>
          <div class="hero-text">
            <h1>Votre passerelle vers les trésors du Burkina Faso</h1>
            <p>Prêt à découvrir des produits authentiques ? Connectez-vous maintenant et laissez LocalMarket vous y emmener. Votre destination de rêve n'est qu'à un clic !</p>
          </div>
          <div class="features">
            <div class="feature">
              <mat-icon>verified</mat-icon>
              <span>Produits 100% authentiques</span>
            </div>
            <div class="feature">
              <mat-icon>local_shipping</mat-icon>
              <span>Livraison dans tout le pays</span>
            </div>
            <div class="feature">
              <mat-icon>support_agent</mat-icon>
              <span>Support client 24/7</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="auth-right">
        <div class="form-container">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }

    /* Left Side - Image */
    .auth-left {
      position: relative;
      flex: 1;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9)),
                  url('https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=1200&fit=crop') center/cover;
      display: none;
      flex-direction: column;
      justify-content: space-between;
      padding: 3rem;
      color: white;
      overflow: hidden;
    }

    @media (min-width: 1024px) {
      .auth-left {
        display: flex;
      }
    }

    .auth-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.9));
      backdrop-filter: blur(2px);
    }

    .auth-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.75rem;
      font-weight: 800;
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .hero-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 500px;
      animation: fadeInUp 0.8s ease-out;
    }

    .hero-text h1 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 1.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .hero-text p {
      font-size: 1.1rem;
      line-height: 1.7;
      opacity: 0.95;
      margin: 0;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .feature:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateX(10px);
    }

    .feature mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .feature span {
      font-weight: 500;
      font-size: 1rem;
    }

    /* Right Side - Form */
    .auth-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: white;
    }

    @media (min-width: 1024px) {
      .auth-right {
        max-width: 600px;
      }
    }

    .form-container {
      width: 100%;
      max-width: 480px;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Mobile Logo */
    @media (max-width: 1023px) {
      .auth-right::before {
        content: '';
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class AuthLayoutComponent { }
