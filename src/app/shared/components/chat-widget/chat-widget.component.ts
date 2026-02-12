import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { trigger, transition, style, animate } from '@angular/animations';

interface Message {
    text: string;
    sender: 'user' | 'vendor';
    time: Date;
}

@Component({
    selector: 'app-chat-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
            ])
        ])
    ],
    template: `
    <!-- Toggle Button -->
    <button mat-fab color="primary" class="fixed bottom-6 right-6 z-50 shadow-lg" (click)="toggleChat()">
      <mat-icon>{{ isOpen ? 'close' : 'chat' }}</mat-icon>
    </button>

    <!-- Chat Window -->
    <mat-card *ngIf="isOpen" [@slideInOut] class="fixed bottom-24 right-6 w-80 h-96 z-50 flex flex-col shadow-2xl rounded-xl overflow-hidden">
      
      <!-- Header -->
      <div class="bg-primary text-white p-4 flex items-center gap-3 shadow-sm">
        <div class="relative">
           <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">V</div>
           <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
        </div>
        <div>
          <h3 class="font-bold text-sm">Service Client</h3>
          <p class="text-xs opacity-80">En ligne</p>
        </div>
      </div>

      <!-- Messages -->
      <div class="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
        <div *ngFor="let msg of messages" 
             [class.self-end]="msg.sender === 'user'"
             [class.ml-auto]="msg.sender === 'user'"
             [class.bg-green-100]="msg.sender === 'user'"
             [class.bg-white]="msg.sender === 'vendor'"
             class="max-w-[80%] p-3 rounded-lg shadow-sm text-sm relative">
           {{ msg.text }}
           <div class="text-[10px] text-gray-400 mt-1 text-right">{{ msg.time | date:'shortTime' }}</div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-2 border-t bg-white flex items-center gap-2">
         <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" 
                placeholder="Votre message..." 
                class="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500">
         <button mat-icon-button color="primary" [disabled]="!newMessage.trim()" (click)="sendMessage()">
           <mat-icon>send</mat-icon>
         </button>
      </div>

    </mat-card>
  `,
    styles: [`
    :host { } 
  `]
})
export class ChatWidgetComponent {
    @Input() vendorName = 'Boutique';
    isOpen = false;
    newMessage = '';

    messages: Message[] = [
        { text: 'Bonjour ! Comment puis-je vous aider ?', sender: 'vendor', time: new Date() }
    ];

    toggleChat() {
        this.isOpen = !this.isOpen;
    }

    sendMessage() {
        if (this.newMessage.trim()) {
            this.messages.push({
                text: this.newMessage,
                sender: 'user',
                time: new Date()
            });
            this.newMessage = '';

            // Auto-reply mock
            setTimeout(() => {
                this.messages.push({
                    text: 'Merci pour votre message. Un agent va vous répondre.',
                    sender: 'vendor',
                    time: new Date()
                });
            }, 1000);
        }
    }
}
