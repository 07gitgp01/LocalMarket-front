import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent
    ],
    template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <app-header></app-header>
      
      <main class="flex-grow min-h-0 flex flex-col">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </div>
  `
})
export class MainLayoutComponent { }
