import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { ProductCardComponent } from '@shared/components/product-card/product-card.component';
import { ProductService } from '@core/services/product.service';
import { Product } from '@shared/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    ProductCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="hero-text">
          <span class="hero-badge">🇧🇫 100% Burkinabé</span>
          <h1 class="hero-title">
            Découvrez les <span class="highlight">Trésors</span> du Burkina Faso
          </h1>
          <p class="hero-description">
            Connectez-vous directement aux producteurs locaux et soutenez l'économie burkinabé.
            Des produits authentiques, frais et de qualité.
          </p>
          <div class="hero-actions">
            <a routerLink="/products" mat-flat-button color="primary" class="hero-btn-primary">
              <mat-icon>shopping_bag</mat-icon>
              <span>Explorer les produits</span>
            </a>
            <a routerLink="/vendors" mat-stroked-button class="hero-btn-secondary">
              <mat-icon>store</mat-icon>
              <span>Devenir vendeur</span>
            </a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Produits</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100+</div>
              <div class="stat-label">Vendeurs</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">13</div>
              <div class="stat-label">Régions</div>
            </div>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-card card-1">
            <mat-icon>shopping_basket</mat-icon>
            <span>Produits Frais</span>
          </div>
          <div class="floating-card card-2">
            <mat-icon>verified</mat-icon>
            <span>Qualité Garantie</span>
          </div>
          <div class="floating-card card-3">
            <mat-icon>local_shipping</mat-icon>
            <span>Livraison Rapide</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Catégories Populaires</h2>
          <p class="section-subtitle">Explorez nos produits par catégorie</p>
        </div>
        <div class="categories-grid">
          <a *ngFor="let category of categories" 
             [routerLink]="['/products']" 
             [queryParams]="{category: category.name}"
             class="category-card">
            <div class="category-icon" [style.background]="category.color">
              <mat-icon>{{ category.icon }}</mat-icon>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} produits</p>
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Produits Vedettes</h2>
          <p class="section-subtitle">Nos meilleures ventes du moment</p>
        </div>
        <div class="products-carousel">
          <div class="products-grid">
            <app-product-card 
              *ngFor="let product of featuredProducts" 
              [product]="product"
              class="product-item">
            </app-product-card>
          </div>
        </div>
        <div class="section-action">
          <a routerLink="/products" mat-stroked-button color="primary">
            Voir tous les produits
            <mat-icon>arrow_forward</mat-icon>
          </a>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Comment ça marche ?</h2>
          <p class="section-subtitle">Acheter local n'a jamais été aussi simple</p>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">
              <mat-icon>search</mat-icon>
            </div>
            <h3 class="step-title">Parcourez</h3>
            <p class="step-description">
              Explorez notre catalogue de produits locaux authentiques
            </p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">
              <mat-icon>shopping_cart</mat-icon>
            </div>
            <h3 class="step-title">Commandez</h3>
            <p class="step-description">
              Ajoutez vos produits préférés au panier et validez
            </p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <h3 class="step-title">Recevez</h3>
            <p class="step-description">
              Recevez vos produits frais directement chez vous
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Ce que disent nos clients</h2>
          <p class="section-subtitle">Des milliers de clients satisfaits</p>
        </div>
        <div class="testimonials-grid">
          <div *ngFor="let testimonial of testimonials" class="testimonial-card">
            <div class="testimonial-rating">
              <mat-icon *ngFor="let star of [1,2,3,4,5]">star</mat-icon>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <img [src]="testimonial.avatar" [alt]="testimonial.name" class="author-avatar">
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Prêt à soutenir l'économie locale ?</h2>
        <p class="cta-description">
          Rejoignez des milliers de Burkinabés qui font confiance à LocalMarket
        </p>
        <a routerLink="/auth/register" mat-flat-button color="primary" class="cta-btn">
          <mat-icon>person_add</mat-icon>
          <span>Créer un compte gratuit</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      position: relative;
      min-height: 600px;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 2rem 1.5rem;
    }

    @media (min-width: 768px) {
      .hero-section {
        min-height: 700px;
        padding: 4rem 1.5rem;
      }
    }

    .hero-background {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
      opacity: 0.95;
    }

    .hero-background::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>');
    }

    .hero-content {
      position: relative;
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr 1fr;
      }
    }

    .hero-text {
      color: white;
      animation: fadeInUp 0.8s ease-out;
    }

    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 1.5rem 0;
    }

    @media (min-width: 768px) {
      .hero-title {
        font-size: 3.5rem;
      }
    }

    .highlight {
      background: linear-gradient(to right, #fbbf24, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.7;
      opacity: 0.95;
      margin: 0 0 2rem 0;
      max-width: 600px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 3rem;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      padding: 0 2rem !important;
      height: 48px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 50px !important;
    }

    .hero-btn-secondary {
      background: rgba(255, 255, 255, 0.15) !important;
      color: white !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
      backdrop-filter: blur(10px);
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 500px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hero-image {
      position: relative;
      height: 400px;
      display: none;
    }

    @media (min-width: 1024px) {
      .hero-image {
        display: block;
      }
    }

    .floating-card {
      position: absolute;
      background: white;
      padding: 1.25rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: float 3s ease-in-out infinite;
    }

    .floating-card mat-icon {
      color: #10b981;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .floating-card span {
      font-weight: 600;
      color: #1f2937;
    }

    .card-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 45%;
      right: 15%;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 15%;
      left: 20%;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
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

    /* Sections */
    .section-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 800;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .section-subtitle {
      font-size: 1.1rem;
      color: #6b7280;
      margin: 0;
    }

    .section-action {
      text-align: center;
      margin-top: 3rem;
    }

    /* Categories */
    .categories-section {
      background: #f9fafb;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 16px;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      border-color: #10b981;
    }

    .category-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .category-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .category-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .category-count {
      font-size: 0.9rem;
      color: #6b7280;
      margin: 0;
    }

    /* Products */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    /* How It Works */
    .how-it-works-section {
      background: linear-gradient(to bottom, white, #f9fafb);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step-card {
      position: relative;
      text-align: center;
      padding: 2rem;
    }

    .step-number {
      position: absolute;
      top: 0;
      right: 1rem;
      font-size: 4rem;
      font-weight: 800;
      color: #10b981;
      opacity: 0.1;
    }

    .step-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .step-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    .step-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .step-description {
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }

    /* Testimonials */
    .testimonials-section {
      background: #f9fafb;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .testimonial-rating {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .testimonial-rating mat-icon {
      color: #fbbf24;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .testimonial-text {
      font-style: italic;
      color: #4b5563;
      line-height: 1.7;
      margin: 0 0 1.5rem 0;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }

    .author-name {
      font-weight: 600;
      color: #1f2937;
    }

    .author-role {
      font-size: 0.9rem;
      color: #6b7280;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #10b981, #059669);
      padding: 5rem 1.5rem;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      color: white;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
    }

    .cta-description {
      font-size: 1.2rem;
      opacity: 0.95;
      margin: 0 0 2rem 0;
    }

    .cta-btn {
      padding: 0 2.5rem !important;
      height: 56px !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      border-radius: 50px !important;
      background: white !important;
      color: #10b981 !important;
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  categories = [
    { name: 'Céréales', icon: 'grass', count: 45, color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
    { name: 'Fruits', icon: 'apple', count: 67, color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { name: 'Légumes', icon: 'eco', count: 52, color: 'linear-gradient(135deg, #10b981, #059669)' },
    { name: 'Artisanat', icon: 'palette', count: 38, color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { name: 'Cosmétiques', icon: 'spa', count: 29, color: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { name: 'Épices', icon: 'restaurant', count: 41, color: 'linear-gradient(135deg, #f97316, #ea580c)' }
  ];

  testimonials = [
    {
      text: 'LocalMarket m\'a permis de découvrir des produits authentiques que je ne trouvais nulle part ailleurs. La qualité est exceptionnelle !',
      name: 'Aminata Traoré',
      role: 'Cliente fidèle',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      text: 'En tant que producteur, cette plateforme m\'a ouvert de nouveaux marchés. Je peux maintenant vendre mes produits dans tout le pays.',
      name: 'Ibrahim Sawadogo',
      role: 'Producteur de karité',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      text: 'Livraison rapide, produits frais, service client au top. Je recommande vivement LocalMarket à tous mes proches !',
      name: 'Fatoumata Ouédraogo',
      role: 'Cliente satisfaite',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  ];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productService.getProducts({ featured: true, limit: 8 }).subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 8);
      },
      error: (err) => console.error('Error loading featured products:', err)
    });
  }
}
