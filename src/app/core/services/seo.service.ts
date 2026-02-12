import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        private title: Title,
        private meta: Meta,
        @Inject(DOCUMENT) private doc: Document
    ) { }

    /**
     * Définit le titre et les balises meta principales
     */
    updateTags(config: { title: string, description: string, image?: string, type?: string }) {
        // Title
        const fullTitle = `${config.title} | LocalMarket`;
        this.title.setTitle(fullTitle);

        // Meta Description
        this.meta.updateTag({ name: 'description', content: config.description });

        // Open Graph (Facebook, LinkedIn)
        this.meta.updateTag({ property: 'og:title', content: fullTitle });
        this.meta.updateTag({ property: 'og:description', content: config.description });
        this.meta.updateTag({ property: 'og:image', content: config.image || 'assets/social-share.png' });
        this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
        this.meta.updateTag({ property: 'og:url', content: this.doc.location.href });

        // Twitter
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
        this.meta.updateTag({ name: 'twitter:description', content: config.description });
        this.meta.updateTag({ name: 'twitter:image', content: config.image || 'assets/social-share.png' });
    }

    /**
     * Injecte des données structurées JSON-LD pour les produits
     */
    setProductStructuredData(product: any) {
        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images || [],
            "description": product.description,
            "brand": {
                "@type": "Brand",
                "name": product.vendor?.shopName || "LocalArtisan"
            },
            "offers": {
                "@type": "Offer",
                "url": this.doc.location.href,
                "priceCurrency": "XOF",
                "price": product.price,
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "itemCondition": "https://schema.org/NewCondition"
            }
        });
        this.doc.head.appendChild(script);
    }
}
