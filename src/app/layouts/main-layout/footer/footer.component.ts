import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <footer class="modern-footer">
      <!-- Newsletter Section -->
      <div class="newsletter-section">
        <div class="newsletter-container">
          <div class="newsletter-content">
            <mat-icon class="newsletter-icon">mail_outline</mat-icon>
            <div class="newsletter-text">
              <h3>Restez informé</h3>
              <p>Recevez nos meilleures offres et actualités</p>
            </div>
          </div>
          <div class="newsletter-form">
            <input 
              type="email" 
              placeholder="Votre email" 
              [(ngModel)]="newsletterEmail"
              class="newsletter-input"
            >
            <button mat-flat-button color="primary" (click)="subscribeNewsletter()" class="newsletter-btn">
              <mat-icon>send</mat-icon>
              <span>S'abonner</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Footer -->
      <div class="footer-main">
        <div class="footer-container">
          <!-- About Column -->
          <div class="footer-column">
            <div class="footer-logo">
              <mat-icon>storefront</mat-icon>
              <span>LocalMarket.bf</span>
            </div>
            <p class="footer-description">
              La première marketplace 100% burkinabé connectant les producteurs locaux aux consommateurs.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <mat-icon>photo_camera</mat-icon>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="footer-column">
            <h4 class="footer-title">Liens Rapides</h4>
            <ul class="footer-links">
              <li><a routerLink="/products">Tous les produits</a></li>
              <li><a routerLink="/vendors">Nos vendeurs</a></li>
              <li><a routerLink="/regions">Par région</a></li>
              <li><a routerLink="/about">À propos</a></li>
              <li><a routerLink="/blog">Blog</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="footer-column">
            <h4 class="footer-title">Catégories</h4>
            <ul class="footer-links">
              <li><a routerLink="/products" [queryParams]="{category: 'Céréales'}">Céréales</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Fruits'}">Fruits & Légumes</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Artisanat'}">Artisanat</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Cosmétiques'}">Cosmétiques Bio</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'Épices'}">Épices</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="footer-column">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-links">
              <li><a routerLink="/help">Centre d'aide</a></li>
              <li><a routerLink="/contact">Nous contacter</a></li>
              <li><a routerLink="/faq">FAQ</a></li>
              <li><a routerLink="/shipping">Livraison</a></li>
              <li><a routerLink="/returns">Retours</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="footer-column">
            <h4 class="footer-title">Contact</h4>
            <ul class="contact-info">
              <li>
                <mat-icon>place</mat-icon>
                <span>Ouagadougou, Burkina Faso</span>
              </li>
              <li>
                <mat-icon>phone</mat-icon>
                <span>+226 XX XX XX XX</span>
              </li>
              <li>
                <mat-icon>email</mat-icon>
                <span>contact@localmarket.bf</span>
              </li>
              <li>
                <mat-icon>schedule</mat-icon>
                <span>Lun-Sam: 8h-18h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-container">
          <div class="footer-bottom-content">
            <p class="copyright">
              © {{ currentYear }} LocalMarket.bf - Tous droits réservés
            </p>
            <div class="footer-bottom-links">
              <a routerLink="/privacy">Confidentialité</a>
              <span class="separator">•</span>
              <a routerLink="/terms">Conditions d'utilisation</a>
              <span class="separator">•</span>
              <a routerLink="/cookies">Cookies</a>
            </div>
            <div class="payment-methods">
              <span class="payment-label">Paiement sécurisé</span>
              <div class="payment-icons">
                <mat-icon>credit_card</mat-icon>
                <mat-icon>account_balance</mat-icon>
                <mat-icon>phone_android</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .modern-footer {
      background: linear-gradient(to bottom, #1f2937, #111827);
      color: #e5e7eb;
    }

    /* Newsletter Section */
    .newsletter-section {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 3rem 1.5rem;
    }

    .newsletter-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
      text-align: center;
    }

    @media (min-width: 768px) {
      .newsletter-container {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .newsletter-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
    }

    .newsletter-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.9;
    }

    .newsletter-text h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.25rem 0;
    }

    .newsletter-text p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }

    .newsletter-form {
      display: flex;
      gap: 0.75rem;
      width: 100%;
      max-width: 400px;
    }

    .newsletter-input {
      flex: 1;
      padding: 0.75rem 1.25rem;
      border-radius: 50px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.3s ease;
    }

    .newsletter-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .newsletter-input:focus {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .newsletter-btn {
      border-radius: 50px !important;
      padding: 0 1.5rem !important;
      background: white !important;
      color: #10b981 !important;
      font-weight: 600 !important;
    }

    /* Main Footer */
    .footer-main {
      padding: 4rem 1.5rem 2rem;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
    }

    @media (min-width: 1024px) {
      .footer-container {
        grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
      }
    }

    .footer-column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .footer-logo mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #10b981;
    }

    .footer-description {
      color: #9ca3af;
      line-height: 1.6;
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #10b981;
      color: white;
      transform: translateY(-3px);
    }

    .footer-title {
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-links a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .footer-links a:hover {
      color: #10b981;
      transform: translateX(4px);
    }

    .contact-info {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-info li {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .contact-info mat-icon {
      color: #10b981;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Bottom Bar */
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem 1.5rem;
    }

    .footer-bottom-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      text-align: center;
    }

    @media (min-width: 768px) {
      .footer-bottom-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .copyright {
      color: #9ca3af;
      font-size: 0.85rem;
      margin: 0;
    }

    .footer-bottom-links {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-bottom-links a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s ease;
    }

    .footer-bottom-links a:hover {
      color: #10b981;
    }

    .separator {
      color: #4b5563;
    }

    .payment-methods {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .payment-label {
      color: #9ca3af;
      font-size: 0.85rem;
    }

    .payment-icons {
      display: flex;
      gap: 0.5rem;
    }

    .payment-icons mat-icon {
      color: #9ca3af;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class FooterComponent {
  newsletterEmail = '';
  currentYear = new Date().getFullYear();

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      // Implement newsletter subscription logic
      this.newsletterEmail = '';
    }
  }
}
