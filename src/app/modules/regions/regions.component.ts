import {
    Component, OnInit, OnDestroy, AfterViewInit,
    inject, signal, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegionService, Region } from '@core/services/region.service';
import { VendorService } from '@core/services/vendor.service';
import * as L from 'leaflet';

interface RegionDisplay extends Region {
    population: number;
    area: number;
    vendorCount: number;
    productCount: number;
}

const VENDOR_COUNTS: Record<number, number> = {
    1: 42, 2: 35, 3: 18, 4: 12, 5: 8, 6: 6, 7: 9,
    8: 5, 9: 11, 10: 14, 11: 7, 12: 10, 13: 6
};
const PRODUCT_COUNTS: Record<number, number> = {
    1: 312, 2: 248, 3: 145, 4: 98, 5: 67, 6: 52, 7: 74,
    8: 43, 9: 89, 10: 112, 11: 58, 12: 82, 13: 47
};

const PRODUCTION: Record<number, { type: string; crops: string[]; output: string; area?: string }> = {
    1:  { type: 'Coopérative agricole',   crops: ['Igname', 'Patate douce', 'Manioc'],              output: '18 t/an',         area: '12 ha' },
    2:  { type: 'Coopérative céréalière', crops: ['Mil', 'Sorgho', 'Maïs'],                         output: '32 t/an',         area: '22 ha' },
    3:  { type: 'Producteur karité',      crops: ['Beurre de karité', 'Savon', 'Huile végét.'],      output: '8 t/an',          area: '15 ha arbres' },
    4:  { type: 'Artisan tisserand',      crops: ['Faso Dan Fani', 'Bogolan', 'Indigo'],             output: '2 400 pièces/an' },
    5:  { type: 'Producteur fruits',      crops: ['Mangue', 'Tamarin', 'Gingembre', 'Baobab'],      output: '15 t/an',         area: '8 ha' },
    6:  { type: 'Maraîcher bio',          crops: ['Tomate', 'Poivron', 'Aubergine', 'Haricot'],     output: '6 t/an',          area: '3 ha' },
    7:  { type: 'Artisan vannerie',       crops: ['Panier tressé', 'Poterie', 'Natte'],              output: '1 800 pièces/an' },
    8:  { type: 'Éleveur avicole',        crops: ['Poulet bicyclette', 'Pintade', 'Œufs'],           output: '4 200 têtes/an',  area: '0.5 ha' },
    9:  { type: 'Artisan cuir',           crops: ['Maroquinerie', 'Sandales', 'Sculpture bois'],     output: '960 pièces/an' },
    10: { type: 'Apiculteur',             crops: ['Miel de brousse', "Cire d'abeille", 'Propolis'], output: '4.5 t/an',        area: '120 ruches' }
};

@Component({
    selector: 'app-regions',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
    template: `
<div class="rp">

  <!-- ═══════════════════ HERO ═══════════════════ -->
  <section class="hero">
    <div class="hero-bg">
      <div class="hbg-grid"></div>
      <div class="hbg-blob1"></div>
      <div class="hbg-blob2"></div>
    </div>

    <!-- Decorative rings (right side) -->
    <div class="hero-deco" aria-hidden="true">
      <div class="hd-r hd-r1"></div>
      <div class="hd-r hd-r2"></div>
      <div class="hd-r hd-r3"></div>
      <div class="hd-r hd-r4"></div>
      <div class="hd-dot hd-d1"></div>
      <div class="hd-dot hd-d2"></div>
      <div class="hd-dot hd-d3"></div>
      <div class="hd-center">🌍</div>
    </div>

    <div class="hero-content">
      <div class="hero-eyebrow">
        <span class="hey-live"></span>
        Burkina Faso · Carte GIS interactive
      </div>

      <h1 class="hero-title">
        Explorez les
        <em>13 Régions</em>
        Productrices
      </h1>

      <p class="hero-sub">
        Survolez une zone pour les statistiques en temps réel —
        cliquez pour zoomer et découvrir chaque région
      </p>

      <div class="hero-kpis">
        <div class="hkpi">
          <span class="hkpi-n">{{ stats().totalRegions }}</span>
          <span class="hkpi-l">Régions</span>
        </div>
        <div class="hkpi-sep"></div>
        <div class="hkpi">
          <span class="hkpi-n">{{ stats().totalVendors }}</span>
          <span class="hkpi-l">Producteurs</span>
        </div>
        <div class="hkpi-sep"></div>
        <div class="hkpi">
          <span class="hkpi-n">{{ stats().totalProducts }}</span>
          <span class="hkpi-l">Produits</span>
        </div>
        <div class="hkpi-sep"></div>
        <div class="hkpi">
          <span class="hkpi-n">{{ stats().activeRegions }}</span>
          <span class="hkpi-l">Zones actives</span>
        </div>
      </div>

      <div class="hero-hint">
        <mat-icon>keyboard_arrow_down</mat-icon>
        <span>Explorer la carte</span>
      </div>
    </div>

    <div class="hero-wave">
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,36 C360,0 720,72 1080,24 C1260,0 1380,48 1440,36 L1440,72 L0,72 Z" fill="#f8fafc"/>
      </svg>
    </div>
  </section>

  <!-- ═══════════════════ FEATURE STRIP ═══════════════════ -->
  <section class="fstrip">
    <div class="fstrip-inner">
      <div class="fsi">
        <div class="fsi-icon fsi-g"><mat-icon>map</mat-icon></div>
        <div class="fsi-text">
          <div class="fsi-title">Carte GIS Interactive</div>
          <div class="fsi-desc">Choropleth par production</div>
        </div>
      </div>
      <div class="fsi-div"></div>
      <div class="fsi">
        <div class="fsi-icon fsi-b"><mat-icon>people</mat-icon></div>
        <div class="fsi-text">
          <div class="fsi-title">{{ stats().totalVendors }} Producteurs</div>
          <div class="fsi-desc">Sur tout le territoire</div>
        </div>
      </div>
      <div class="fsi-div"></div>
      <div class="fsi">
        <div class="fsi-icon fsi-a"><mat-icon>eco</mat-icon></div>
        <div class="fsi-text">
          <div class="fsi-title">{{ stats().totalProducts }} Produits</div>
          <div class="fsi-desc">Certifiés locaux</div>
        </div>
      </div>
      <div class="fsi-div"></div>
      <div class="fsi">
        <div class="fsi-icon fsi-p"><mat-icon>local_shipping</mat-icon></div>
        <div class="fsi-text">
          <div class="fsi-title">{{ stats().activeRegions }} Zones livrées</div>
          <div class="fsi-desc">Livraison disponible</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════ MAP EXPLORER ═══════════════════ -->
  <section class="explorer-section">
    @if (isLoading()) {
      <div class="map-load">
        <mat-progress-spinner mode="indeterminate" diameter="40" strokeWidth="3"></mat-progress-spinner>
        <span>Initialisation de la carte...</span>
      </div>
    }

    <div class="map-panel">
      <div class="map-label">
        <mat-icon>layers</mat-icon>
        Burkina Faso · Production GIS
      </div>
      <div #mapEl class="the-map"></div>
    </div>

    <aside class="info-panel">
      <div class="ip-hdr">
        <span class="iph-title">Régions</span>
        <div class="iph-legend">
          <span>Faible</span>
          <div class="iph-grad-bar"></div>
          <span>Fort</span>
        </div>
      </div>

      <div class="ip-list">
        @for (r of regions(); track r.id) {
          <div class="ipl-item" [class.ipl-active]="selectedRegion()?.id === r.id"
               (click)="selectRegion(r)">
            <div class="ipli-sw" [style.background]="getRegionColor(r)"></div>
            <div class="ipli-body">
              <div class="ipli-name">{{ r.name }}</div>
              <div class="ipli-cap"><mat-icon>place</mat-icon>{{ r.capital }}</div>
            </div>
            <div class="ipli-right">
              <div class="ipli-count" [style.color]="getRegionColor(r)">{{ r.vendorCount }}</div>
              <div class="ipli-lbl">vendeurs</div>
            </div>
            <mat-icon class="ipli-arr">chevron_right</mat-icon>
          </div>
        }
      </div>

      @if (selectedRegion(); as reg) {
        <div class="dp">
          <div class="dp-top" [style.background]="getRegionColor(reg)">
            <div class="dpt-deco"></div>
            <div class="dpt-main">
              <div class="dpt-name">{{ reg.name }}</div>
              <div class="dpt-cap">{{ reg.capital }}</div>
            </div>
            <button class="dpt-x" (click)="selectedRegion.set(null)">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="dp-body">
            <div class="dp-g3">
              <div class="dpg dpg-b">
                <div class="dpg-v">{{ reg.vendorCount }}</div>
                <div class="dpg-l">Vendeurs</div>
              </div>
              <div class="dpg dpg-g">
                <div class="dpg-v">{{ reg.productCount }}</div>
                <div class="dpg-l">Produits</div>
              </div>
              <div class="dpg dpg-a">
                <div class="dpg-v">{{ reg.deliveryFee | number:'1.0-0' }}</div>
                <div class="dpg-l">FCFA livr.</div>
              </div>
            </div>

            <div class="dp-prod-row">
              <span>Intensité production</span>
              <strong [style.color]="getRegionColor(reg)">{{ getProductionPct(reg) }}%</strong>
            </div>
            <div class="dp-bar-track">
              <div class="dp-bar-fill"
                   [style.width.%]="getProductionPct(reg)"
                   [style.background]="getRegionColor(reg)"></div>
            </div>

            <div class="dp-meta">
              <span><mat-icon>people</mat-icon>{{ (reg.population / 1_000_000).toFixed(2) }}M hab.</span>
              <span><mat-icon>straighten</mat-icon>{{ reg.area | number:'1.0-0' }} km²</span>
            </div>

            <div class="dp-tags">
              @for (p of reg.provinces; track p) {
                <span class="dp-tag">{{ p }}</span>
              }
            </div>
          </div>
        </div>
      }
    </aside>
  </section>

  <!-- ═══════════════════ METRICS ═══════════════════ -->
  <section class="metrics">
    <div class="metrics-inner">
      <div class="met met-purple">
        <div class="met-accent"></div>
        <div class="met-icon"><mat-icon>map</mat-icon></div>
        <div class="met-body">
          <div class="met-v">{{ stats().totalRegions }}</div>
          <div class="met-l">Régions couvertes</div>
          <div class="met-bar"><div class="mb-fill" style="width:100%"></div></div>
        </div>
      </div>
      <div class="met met-blue">
        <div class="met-accent"></div>
        <div class="met-icon"><mat-icon>store</mat-icon></div>
        <div class="met-body">
          <div class="met-v">{{ stats().totalVendors }}</div>
          <div class="met-l">Vendeurs actifs</div>
          <div class="met-bar"><div class="mb-fill" style="width:65%"></div></div>
        </div>
      </div>
      <div class="met met-green">
        <div class="met-accent"></div>
        <div class="met-icon"><mat-icon>inventory_2</mat-icon></div>
        <div class="met-body">
          <div class="met-v">{{ stats().totalProducts }}</div>
          <div class="met-l">Produits listés</div>
          <div class="met-bar"><div class="mb-fill" style="width:88%"></div></div>
        </div>
      </div>
      <div class="met met-orange">
        <div class="met-accent"></div>
        <div class="met-icon"><mat-icon>local_shipping</mat-icon></div>
        <div class="met-body">
          <div class="met-v">{{ stats().activeRegions }}</div>
          <div class="met-l">Zones livrées</div>
          <div class="met-bar"><div class="mb-fill" style="width:75%"></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════ CARDS ═══════════════════ -->
  <section class="cards-section">
    <div class="cards-inner">

      <div class="cs-head">
        <div class="csh-text">
          <h2>Vue d'ensemble des régions</h2>
          <p>{{ regions().length }} régions · Cliquez pour zoomer sur la carte</p>
        </div>
        <div class="csh-top3">
          @for (r of topRegions; track r.id; let i = $index) {
            <button class="t3-pill" (click)="selectRegion(r)">
              <span>{{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}</span>
              <span>{{ r.name }}</span>
              <span class="t3-cnt">{{ r.productCount }}</span>
            </button>
          }
        </div>
      </div>

      <div class="cards-grid">
        @for (r of regions(); track r.id) {
          <div class="rcard" [class.rcard-sel]="selectedRegion()?.id === r.id"
               (click)="selectRegion(r)">

            <div class="rch" [style.background]="getRegionColor(r)">
              <div class="rch-deco1"></div>
              <div class="rch-deco2"></div>
              <div class="rch-row1">
                <span class="rch-badge-num">#{{ r.id }}</span>
                <span class="rch-active">
                  <span class="rcha-dot"></span>Actif
                </span>
              </div>
              <div class="rch-big">{{ r.productCount }}</div>
              <div class="rch-biglbl">produits listés</div>
              <div class="rch-name">{{ r.name }}</div>
              <div class="rch-cap"><mat-icon>place</mat-icon>{{ r.capital }}</div>
            </div>

            <div class="rcp-wrap">
              <div class="rcp-fill"
                   [style.width.%]="getProductionPct(r)"
                   [style.background]="getRegionColor(r)"></div>
            </div>

            <div class="rcb">
              <div class="rcb-kpis">
                <div class="rcbk">
                  <div class="rcbk-icon" [style.color]="getRegionColor(r)">
                    <mat-icon>store</mat-icon>
                  </div>
                  <div>
                    <div class="rcbk-v">{{ r.vendorCount }}</div>
                    <div class="rcbk-l">Vendeurs</div>
                  </div>
                </div>
                <div class="rcb-sep"></div>
                <div class="rcbk">
                  <div class="rcbk-icon" style="color:#3b82f6">
                    <mat-icon>local_shipping</mat-icon>
                  </div>
                  <div>
                    <div class="rcbk-v">{{ r.deliveryFee | number:'1.0-0' }}</div>
                    <div class="rcbk-l">FCFA livr.</div>
                  </div>
                </div>
              </div>
              <div class="rcb-foot">
                <span><mat-icon>people</mat-icon>{{ (r.population / 1_000_000).toFixed(1) }}M</span>
                <span><mat-icon>straighten</mat-icon>{{ r.area | number:'1.0-0' }} km²</span>
                <span class="rcb-cta">Explorer <mat-icon>arrow_forward</mat-icon></span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </section>

  <!-- ═══════════════════ CTA FOOTER ═══════════════════ -->
  <section class="cta-foot">
    <div class="ctaf-grid"></div>
    <div class="ctaf-inner">
      <div class="ctaf-icon-wrap"><mat-icon>eco</mat-icon></div>
      <h2>Rejoignez le marché local du Burkina</h2>
      <p>Connectez-vous directement avec les producteurs de votre région</p>
      <div class="ctaf-btns">
        <button class="ctab-p"><mat-icon>storefront</mat-icon> Parcourir les produits</button>
        <button class="ctab-s"><mat-icon>person_add</mat-icon> Devenir vendeur</button>
      </div>
    </div>
  </section>

</div>
    `,
    styles: [`
    :host { display: block; background: #f8fafc; }

    /* ── HERO ──────────────────────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #052e16 0%, #064e3b 55%, #065f46 100%);
      padding: 5.5rem 2rem 7rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero-bg { position: absolute; inset: 0; pointer-events: none; }
    .hbg-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(16,185,129,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16,185,129,.06) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .hbg-blob1 {
      position: absolute; width: 700px; height: 700px; border-radius: 50%;
      background: radial-gradient(circle, rgba(52,211,153,.11) 0%, transparent 70%);
      top: -200px; right: -150px;
    }
    .hbg-blob2 {
      position: absolute; width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(16,185,129,.08) 0%, transparent 70%);
      bottom: -100px; left: -50px;
    }

    /* Decorative rings */
    .hero-deco {
      position: absolute; right: calc(50% - 680px); top: 50%;
      transform: translateY(-50%);
      width: 460px; height: 460px;
      pointer-events: none;
      display: none;
    }
    @media (min-width: 1200px) { .hero-deco { display: block; } }
    .hd-r {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(52,211,153,.12);
    }
    .hd-r1 { inset: 0; }
    .hd-r2 { inset: 46px; border-color: rgba(52,211,153,.18); }
    .hd-r3 { inset: 92px; border-color: rgba(52,211,153,.28); animation: spin-slow 22s linear infinite; }
    .hd-r4 { inset: 138px; border-color: rgba(52,211,153,.4); }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    .hd-dot { position: absolute; border-radius: 50%; background: #34d399; }
    .hd-d1 { width: 12px; height: 12px; top: 8%; left: 52%; box-shadow: 0 0 14px rgba(52,211,153,.85); animation: fdot 4s ease-in-out infinite; }
    .hd-d2 { width: 7px; height: 7px; top: 62%; left: 12%; opacity: .6; animation: fdot 3s ease-in-out 1s infinite; }
    .hd-d3 { width: 9px; height: 9px; top: 78%; left: 72%; opacity: .5; animation: fdot 5s ease-in-out .5s infinite; }
    @keyframes fdot { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .hd-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 4.5rem; filter: drop-shadow(0 0 20px rgba(52,211,153,.4)); }

    .hero-content { max-width: 720px; margin: 0 auto; position: relative; z-index: 1; }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: .6rem;
      border: 1px solid rgba(52,211,153,.4); border-radius: 999px;
      padding: .45rem 1.25rem; color: #6ee7b7;
      font-size: .84rem; font-weight: 600; margin-bottom: 1.75rem;
      background: rgba(52,211,153,.07);
    }
    .hey-live {
      width: 8px; height: 8px; border-radius: 50%; background: #34d399;
      box-shadow: 0 0 8px rgba(52,211,153,.8);
      animation: pulse-live 2s ease-in-out infinite;
    }
    @keyframes pulse-live { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:.4; transform: scale(.65); } }
    .hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 900; color: white;
      margin: 0 0 1.1rem; letter-spacing: -.04em; line-height: 1.08;
    }
    .hero-title em { color: #34d399; font-style: normal; display: block; }
    .hero-sub { font-size: 1.05rem; color: rgba(255,255,255,.62); margin: 0 0 2.5rem; line-height: 1.6; }

    .hero-kpis {
      display: inline-flex; align-items: center; gap: 1.75rem;
      background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.11);
      border-radius: 20px; padding: 1.375rem 2.5rem;
      backdrop-filter: blur(8px); margin-bottom: 2rem;
    }
    .hkpi { text-align: center; }
    .hkpi-n { display: block; font-size: 2.1rem; font-weight: 900; color: white; line-height: 1; }
    .hkpi-l { display: block; font-size: .68rem; color: rgba(255,255,255,.5); margin-top: .3rem; letter-spacing: .06em; text-transform: uppercase; }
    .hkpi-sep { width: 1px; height: 46px; background: rgba(255,255,255,.13); }

    .hero-hint {
      display: inline-flex; align-items: center; gap: .4rem;
      color: rgba(255,255,255,.4); font-size: .8rem;
      animation: bounce-y 2s ease-in-out infinite;
    }
    .hero-hint mat-icon { font-size: 1.25rem; }
    @keyframes bounce-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

    .hero-wave {
      position: absolute; bottom: -1px; left: 0; right: 0; height: 72px;
    }
    .hero-wave svg { width: 100%; height: 100%; }

    /* ── FEATURE STRIP ─────────────────────────────────────────── */
    .fstrip {
      background: white;
      border-bottom: 1px solid #f1f5f9;
      box-shadow: 0 2px 20px rgba(0,0,0,.05);
      position: relative; z-index: 5;
    }
    .fstrip-inner {
      max-width: 1100px; margin: 0 auto; padding: 0 2rem;
      display: flex; align-items: center;
    }
    .fsi {
      flex: 1; display: flex; align-items: center; gap: 1rem;
      padding: 1.625rem 1.75rem;
    }
    .fsi-icon {
      width: 50px; height: 50px; border-radius: 14px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .fsi-icon mat-icon { font-size: 1.35rem; width: 1.35rem; height: 1.35rem; }
    .fsi-g { background: linear-gradient(135deg,#d1fae5,#a7f3d0); }
    .fsi-g mat-icon { color: #059669; }
    .fsi-b { background: linear-gradient(135deg,#dbeafe,#bfdbfe); }
    .fsi-b mat-icon { color: #2563eb; }
    .fsi-a { background: linear-gradient(135deg,#fef9c3,#fde68a); }
    .fsi-a mat-icon { color: #d97706; }
    .fsi-p { background: linear-gradient(135deg,#ede9fe,#ddd6fe); }
    .fsi-p mat-icon { color: #7c3aed; }
    .fsi-title { font-size: .9rem; font-weight: 700; color: #0f172a; }
    .fsi-desc { font-size: .77rem; color: #94a3b8; margin-top: 1px; }
    .fsi-div { width: 1px; height: 44px; background: #f1f5f9; flex-shrink: 0; }

    /* ── EXPLORER SECTION ──────────────────────────────────────── */
    .explorer-section {
      display: flex;
      height: 620px;
      border-top: 1px solid #f1f5f9;
      border-bottom: 1px solid #e2e8f0;
      position: relative;
      isolation: isolate; /* contains Leaflet z-indexes — CRITICAL */
      overflow: hidden;
      background: white;
    }
    .map-panel {
      flex: 1; min-width: 0;
      position: relative; overflow: hidden;
    }
    .the-map { position: absolute; inset: 0; } /* NOT width/height 100% */
    .map-load {
      position: absolute; inset: 0; z-index: 20;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: .875rem;
      background: #f0fdf4;
    }
    .map-load span { font-size: .875rem; color: #6b7280; }

    .map-label {
      position: absolute; top: 1rem; left: 1rem; z-index: 10;
      background: rgba(255,255,255,.92); backdrop-filter: blur(10px);
      border: 1px solid rgba(0,0,0,.07); border-radius: 10px;
      padding: .45rem .9rem;
      display: flex; align-items: center; gap: .4rem;
      font-size: .8rem; font-weight: 700; color: #0f172a;
      box-shadow: 0 4px 16px rgba(0,0,0,.1); pointer-events: none;
    }
    .map-label mat-icon { font-size: 1rem; width: 1rem; height: 1rem; color: #10b981; }

    /* ── INFO PANEL ────────────────────────────────────────────── */
    .info-panel {
      width: 340px; flex-shrink: 0; display: flex; flex-direction: column;
      background: white; border-left: 1px solid #e2e8f0;
      box-shadow: -4px 0 28px rgba(0,0,0,.07);
    }
    .ip-hdr {
      padding: 1.25rem 1.5rem 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .iph-title { font-size: 1rem; font-weight: 800; color: #0f172a; display: block; margin-bottom: .75rem; }
    .iph-legend { display: flex; align-items: center; gap: .5rem; }
    .iph-legend span { font-size: .7rem; font-weight: 600; color: #9ca3af; }
    .iph-grad-bar {
      flex: 1; height: 7px; border-radius: 4px;
      background: linear-gradient(90deg,#d1fae5,#a7f3d0,#34d399,#059669,#065f46);
    }
    .ip-list { flex: 1; overflow-y: auto; padding: .5rem; }
    .ipl-item {
      display: flex; align-items: center; gap: .75rem;
      padding: .7rem .875rem; border-radius: 12px;
      cursor: pointer; transition: background .15s;
    }
    .ipl-item:hover { background: #f8fafc; }
    .ipl-item.ipl-active { background: #f0fdf4; }
    .ipli-sw { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .ipli-body { flex: 1; min-width: 0; }
    .ipli-name { font-size: .85rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ipli-cap {
      display: flex; align-items: center; gap: .2rem;
      font-size: .71rem; color: #94a3b8; margin-top: 1px;
    }
    .ipli-cap mat-icon { font-size: 11px; width: 11px; height: 11px; }
    .ipli-right { text-align: right; }
    .ipli-count { font-size: .9rem; font-weight: 800; line-height: 1; }
    .ipli-lbl { font-size: .65rem; color: #94a3b8; }
    .ipli-arr { font-size: 16px; width: 16px; height: 16px; color: #cbd5e1; }

    /* ── DETAIL PANE ───────────────────────────────────────────── */
    .dp { flex-shrink: 0; border-top: 1px solid #e2e8f0; }
    .dp-top {
      display: flex; justify-content: space-between; align-items: center;
      padding: .875rem 1.25rem; position: relative; overflow: hidden;
    }
    .dpt-deco {
      position: absolute; right: -20px; top: -20px;
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(255,255,255,.12); pointer-events: none;
    }
    .dpt-name { font-size: .95rem; font-weight: 800; color: white; position: relative; }
    .dpt-cap { font-size: .73rem; color: rgba(255,255,255,.72); margin-top: 2px; position: relative; }
    .dpt-x {
      background: rgba(255,255,255,.2); border: none; border-radius: 8px;
      width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: white; flex-shrink: 0; position: relative;
    }
    .dpt-x mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .dp-body { padding: .875rem 1.25rem; }
    .dp-g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .5rem; margin-bottom: .875rem; }
    .dpg { text-align: center; border-radius: 10px; padding: .5rem .25rem; }
    .dpg-b { background: #eff6ff; }
    .dpg-g { background: #f0fdf4; }
    .dpg-a { background: #fffbeb; }
    .dpg-v { font-size: .95rem; font-weight: 800; color: #1e293b; }
    .dpg-l { font-size: .62rem; color: #94a3b8; }
    .dp-prod-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: .73rem; color: #94a3b8; margin-bottom: .375rem;
    }
    .dp-prod-row strong { font-weight: 800; }
    .dp-bar-track { height: 7px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: .75rem; }
    .dp-bar-fill { height: 100%; border-radius: 4px; transition: width .6s ease; }
    .dp-meta { display: flex; gap: .75rem; margin-bottom: .75rem; }
    .dp-meta span { display: flex; align-items: center; gap: .3rem; font-size: .75rem; color: #64748b; }
    .dp-meta mat-icon { font-size: 14px; width: 14px; height: 14px; color: #94a3b8; }
    .dp-tags { display: flex; flex-wrap: wrap; gap: .3rem; }
    .dp-tag { background: #f1f5f9; color: #475569; font-size: .65rem; padding: .2rem .55rem; border-radius: 999px; }

    /* ── METRICS ───────────────────────────────────────────────── */
    .metrics {
      background: #0f172a; padding: 3.5rem 0;
    }
    .metrics-inner {
      max-width: 1300px; margin: 0 auto; padding: 0 2rem;
      display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem;
    }
    .met {
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07);
      border-radius: 20px; padding: 1.625rem;
      display: flex; align-items: center; gap: 1.25rem;
      position: relative; overflow: hidden;
      transition: transform .2s, box-shadow .2s;
    }
    .met:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
    .met-accent {
      position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px;
    }
    .met-purple .met-accent { background: linear-gradient(180deg,#a855f7,#9333ea); }
    .met-blue   .met-accent { background: linear-gradient(180deg,#3b82f6,#2563eb); }
    .met-green  .met-accent { background: linear-gradient(180deg,#10b981,#059669); }
    .met-orange .met-accent { background: linear-gradient(180deg,#f97316,#ea580c); }
    .met-icon {
      width: 54px; height: 54px; border-radius: 16px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .met-icon mat-icon { font-size: 1.6rem; width: 1.6rem; height: 1.6rem; }
    .met-purple .met-icon { background: rgba(168,85,247,.15); }
    .met-purple .met-icon mat-icon { color: #c084fc; }
    .met-blue   .met-icon { background: rgba(59,130,246,.15); }
    .met-blue   .met-icon mat-icon { color: #60a5fa; }
    .met-green  .met-icon { background: rgba(16,185,129,.15); }
    .met-green  .met-icon mat-icon { color: #34d399; }
    .met-orange .met-icon { background: rgba(249,115,22,.15); }
    .met-orange .met-icon mat-icon { color: #fb923c; }
    .met-body { flex: 1; }
    .met-v { font-size: 2.25rem; font-weight: 900; color: white; line-height: 1; }
    .met-l { font-size: .8rem; color: rgba(255,255,255,.45); margin-top: .25rem; }
    .met-bar { height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; margin-top: .875rem; overflow: hidden; }
    .mb-fill { height: 100%; border-radius: 2px; }
    .met-purple .mb-fill { background: linear-gradient(90deg,#a855f7,#9333ea); }
    .met-blue   .mb-fill { background: linear-gradient(90deg,#3b82f6,#2563eb); }
    .met-green  .mb-fill { background: linear-gradient(90deg,#10b981,#059669); }
    .met-orange .mb-fill { background: linear-gradient(90deg,#f97316,#ea580c); }

    /* ── CARDS SECTION ─────────────────────────────────────────── */
    .cards-section { background: #f8fafc; padding: 4rem 0; }
    .cards-inner { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }

    .cs-head {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 1.5rem; margin-bottom: 2.5rem; flex-wrap: wrap;
    }
    .csh-text h2 { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 0 0 .3rem; }
    .csh-text p { font-size: .9rem; color: #94a3b8; margin: 0; }
    .csh-top3 { display: flex; gap: .75rem; flex-wrap: wrap; }
    .t3-pill {
      display: flex; align-items: center; gap: .5rem;
      background: white; border: 1.5px solid #e2e8f0; border-radius: 999px;
      padding: .45rem 1rem; font-size: .82rem; font-weight: 600; color: #1e293b;
      cursor: pointer; transition: all .2s;
    }
    .t3-pill:hover { background: #f0fdf4; border-color: #10b981; }
    .t3-cnt {
      background: #f0fdf4; color: #059669;
      font-size: .69rem; font-weight: 700;
      padding: .1rem .45rem; border-radius: 999px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.5rem;
    }

    /* Card */
    .rcard {
      background: white; border-radius: 22px; overflow: hidden;
      cursor: pointer; border: 2px solid transparent;
      box-shadow: 0 4px 16px rgba(0,0,0,.07);
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .2s;
    }
    .rcard:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 56px rgba(0,0,0,.14);
    }
    .rcard.rcard-sel { border-color: #10b981; }

    .rch {
      position: relative; padding: 1.5rem 1.5rem 1.375rem;
      overflow: hidden;
    }
    .rch::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(160deg, rgba(0,0,0,.17) 0%, rgba(0,0,0,.03) 100%);
      pointer-events: none;
    }
    .rch-deco1 {
      position: absolute; right: -28px; top: -28px;
      width: 120px; height: 120px; border-radius: 50%;
      background: rgba(255,255,255,.11); pointer-events: none;
    }
    .rch-deco2 {
      position: absolute; right: 28px; bottom: -36px;
      width: 86px; height: 86px; border-radius: 50%;
      background: rgba(255,255,255,.07); pointer-events: none;
    }
    .rch-row1 {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: .875rem; position: relative; z-index: 1;
    }
    .rch-badge-num {
      font-size: .73rem; font-weight: 700; color: rgba(255,255,255,.72);
      background: rgba(255,255,255,.15); padding: .2rem .6rem; border-radius: 999px;
    }
    .rch-active {
      display: flex; align-items: center; gap: .35rem;
      font-size: .71rem; font-weight: 700; color: white;
      background: rgba(255,255,255,.2); padding: .2rem .7rem; border-radius: 999px;
    }
    .rcha-dot {
      width: 6px; height: 6px; border-radius: 50%; background: white;
      box-shadow: 0 0 6px rgba(255,255,255,.9);
      animation: blink-dot 2s ease-in-out infinite;
    }
    @keyframes blink-dot { 0%,100% { opacity:1; } 50% { opacity:.25; } }
    .rch-big {
      font-size: 2.9rem; font-weight: 900; color: white;
      line-height: 1; letter-spacing: -.04em; position: relative; z-index: 1;
    }
    .rch-biglbl {
      font-size: .71rem; color: rgba(255,255,255,.72); font-weight: 500;
      margin-bottom: .875rem; position: relative; z-index: 1;
    }
    .rch-name {
      font-size: 1.1rem; font-weight: 800; color: white;
      position: relative; z-index: 1; margin-bottom: .2rem;
    }
    .rch-cap {
      display: flex; align-items: center; gap: .3rem;
      font-size: .75rem; color: rgba(255,255,255,.75);
      position: relative; z-index: 1;
    }
    .rch-cap mat-icon { font-size: 13px; width: 13px; height: 13px; }

    .rcp-wrap { height: 4px; background: #e2e8f0; }
    .rcp-fill { height: 100%; transition: width .8s ease; }

    .rcb { padding: 1.125rem 1.5rem 1.25rem; }
    .rcb-kpis { display: flex; align-items: center; gap: .5rem; margin-bottom: .875rem; }
    .rcbk { display: flex; align-items: center; gap: .6rem; flex: 1; }
    .rcbk-icon { display: flex; }
    .rcbk-icon mat-icon { font-size: 1.15rem; width: 1.15rem; height: 1.15rem; }
    .rcbk-v { font-size: .95rem; font-weight: 800; color: #0f172a; line-height: 1; }
    .rcbk-l { font-size: .66rem; color: #94a3b8; margin-top: 2px; }
    .rcb-sep { width: 1px; height: 32px; background: #f1f5f9; flex-shrink: 0; }

    .rcb-foot {
      display: flex; align-items: center; gap: .75rem;
      padding-top: .75rem; border-top: 1px solid #f8fafc;
      font-size: .72rem; color: #94a3b8;
    }
    .rcb-foot span { display: flex; align-items: center; gap: .25rem; }
    .rcb-foot mat-icon { font-size: 13px; width: 13px; height: 13px; }
    .rcb-cta {
      margin-left: auto; display: flex; align-items: center; gap: .25rem;
      font-size: .73rem; font-weight: 700; color: #10b981;
      opacity: 0; transform: translateX(-6px);
      transition: opacity .25s, transform .25s;
    }
    .rcb-cta mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .rcard:hover .rcb-cta { opacity: 1; transform: translateX(0); }

    /* ── CTA FOOTER ────────────────────────────────────────────── */
    .cta-foot {
      background: linear-gradient(135deg, #052e16 0%, #065f46 60%, #059669 100%);
      padding: 5.5rem 2rem; text-align: center; position: relative; overflow: hidden;
    }
    .ctaf-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(52,211,153,.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(52,211,153,.05) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .ctaf-inner { max-width: 580px; margin: 0 auto; position: relative; z-index: 1; }
    .ctaf-icon-wrap {
      width: 76px; height: 76px; background: rgba(255,255,255,.14);
      border-radius: 24px; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.625rem;
      border: 1px solid rgba(255,255,255,.2);
    }
    .ctaf-icon-wrap mat-icon { font-size: 2.25rem; width: 2.25rem; height: 2.25rem; color: white; }
    .cta-foot h2 {
      font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 900; color: white;
      margin: 0 0 .75rem; letter-spacing: -.02em;
    }
    .cta-foot p { font-size: 1.05rem; color: rgba(255,255,255,.65); margin: 0 0 2.5rem; }
    .ctaf-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .ctab-p {
      display: flex; align-items: center; gap: .5rem;
      background: white; color: #059669; border: none; border-radius: 14px;
      padding: .9rem 1.875rem; font-size: .95rem; font-weight: 700; cursor: pointer;
      box-shadow: 0 8px 28px rgba(0,0,0,.18);
      transition: transform .2s, box-shadow .2s;
    }
    .ctab-p:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,0,0,.25); }
    .ctab-p mat-icon { font-size: 1.15rem; }
    .ctab-s {
      display: flex; align-items: center; gap: .5rem;
      background: transparent; color: white;
      border: 2px solid rgba(255,255,255,.35); border-radius: 14px;
      padding: .9rem 1.875rem; font-size: .95rem; font-weight: 700; cursor: pointer;
      transition: all .2s;
    }
    .ctab-s:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.65); }
    .ctab-s mat-icon { font-size: 1.15rem; }

    /* ── VENDOR PIN ────────────────────────────────────────────── */
    ::ng-deep .vpin {
      display: flex; flex-direction: column; align-items: center;
      cursor: pointer; filter: drop-shadow(0 4px 8px rgba(239,68,68,.45));
    }
    ::ng-deep .vpin-body {
      width: 30px; height: 30px; background: #ef4444;
      border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
      border: 2.5px solid white;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; font-family: system-ui;
      color: white; transition: transform .2s;
    }
    ::ng-deep .vpin:hover .vpin-body { transform: rotate(-45deg) scale(1.2); background: #dc2626; }
    ::ng-deep .vpin-tip {
      width: 0; height: 0;
      border-left: 5px solid transparent; border-right: 5px solid transparent;
      border-top: 8px solid #ef4444; margin-top: -1px;
    }
    ::ng-deep .vpin-shadow {
      width: 10px; height: 3px; background: rgba(0,0,0,.2);
      border-radius: 50%; margin-top: 2px; filter: blur(2px);
    }

    /* ── VENDOR TOOLTIP ────────────────────────────────────────── */
    ::ng-deep .vtt.leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
    ::ng-deep .vtt.leaflet-tooltip::before { display: none !important; }
    ::ng-deep .vtt-card { background: white; border-radius: 14px; box-shadow: 0 16px 48px rgba(0,0,0,.18); width: 250px; overflow: hidden; font-family: system-ui, sans-serif; pointer-events: none; }
    ::ng-deep .vtt-head { background: linear-gradient(135deg,#ef4444,#dc2626); padding: .875rem 1rem; }
    ::ng-deep .vtt-type { display: inline-block; background: rgba(255,255,255,.2); color: rgba(255,255,255,.9); font-size: .68rem; font-weight: 700; padding: .15rem .6rem; border-radius: 999px; margin-bottom: .4rem; }
    ::ng-deep .vtt-name { font-size: .95rem; font-weight: 800; color: white; }
    ::ng-deep .vtt-loc { font-size: .72rem; color: rgba(255,255,255,.75); margin-top: 2px; }
    ::ng-deep .vtt-body { padding: .875rem 1rem; }
    ::ng-deep .vtt-crops { display: flex; flex-wrap: wrap; gap: .3rem; margin-bottom: .75rem; }
    ::ng-deep .vtc { background: #fef2f2; color: #991b1b; font-size: .68rem; font-weight: 600; padding: .2rem .55rem; border-radius: 999px; }
    ::ng-deep .vtt-output { display: flex; align-items: baseline; gap: .4rem; margin-bottom: .5rem; }
    ::ng-deep .vto-v { font-size: 1.15rem; font-weight: 800; color: #ef4444; }
    ::ng-deep .vto-l { font-size: .7rem; color: #9ca3af; }
    ::ng-deep .vtt-row { display: flex; align-items: center; gap: .4rem; font-size: .75rem; color: #6b7280; margin-bottom: .4rem; }
    ::ng-deep .vtt-footer { display: flex; align-items: center; gap: .5rem; padding-top: .5rem; border-top: 1px solid #f3f4f6; }
    ::ng-deep .vtt-stars { color: #f59e0b; font-size: .8rem; }
    ::ng-deep .vtt-rating { font-size: .72rem; color: #9ca3af; }

    /* ── REGION TOOLTIP ────────────────────────────────────────── */
    ::ng-deep .rtt.leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
    ::ng-deep .rtt.leaflet-tooltip::before { display: none !important; }
    ::ng-deep .rtt-card { background: white; border-radius: 14px; box-shadow: 0 20px 64px rgba(0,0,0,.18); width: 260px; overflow: hidden; font-family: system-ui, sans-serif; pointer-events: none; }
    ::ng-deep .rtt-head { padding: .875rem 1rem; color: white; }
    ::ng-deep .rtt-title { font-size: 1rem; font-weight: 800; display: block; }
    ::ng-deep .rtt-sub { font-size: .75rem; opacity: .8; margin-top: 2px; display: block; }
    ::ng-deep .rtt-body { padding: .875rem 1rem; }
    ::ng-deep .rtt-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: .75rem; }
    ::ng-deep .rtt-kpi { border-radius: 10px; padding: .6rem; }
    ::ng-deep .rtt-kpi.k1 { background: #f0fdf4; } ::ng-deep .rtt-kpi.k2 { background: #eff6ff; } ::ng-deep .rtt-kpi.k3 { background: #fffbeb; } ::ng-deep .rtt-kpi.k4 { background: #faf5ff; }
    ::ng-deep .rtt-kv { display: block; font-size: 1.125rem; font-weight: 800; color: #1e293b; }
    ::ng-deep .rtt-kl { font-size: .68rem; color: #94a3b8; }
    ::ng-deep .rtt-bar-wrap { margin-bottom: .625rem; }
    ::ng-deep .rtt-bar-lbl { font-size: .7rem; color: #94a3b8; margin-bottom: .3rem; }
    ::ng-deep .rtt-bar-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    ::ng-deep .rtt-bar-fill { height: 100%; border-radius: 3px; }
    ::ng-deep .rtt-footer { font-size: .72rem; color: #94a3b8; padding-top: .5rem; border-top: 1px solid #f1f5f9; }

    /* ── PRODUCTION LEGEND ─────────────────────────────────────── */
    ::ng-deep .prod-legend { background: rgba(255,255,255,.95) !important; border-radius: 12px !important; padding: .875rem 1rem !important; box-shadow: 0 8px 32px rgba(0,0,0,.14) !important; font-family: system-ui, sans-serif !important; border: 1px solid rgba(0,0,0,.06) !important; min-width: 160px !important; }
    ::ng-deep .pl-title { font-size: .75rem; font-weight: 700; color: #1e293b; margin-bottom: .625rem; letter-spacing: .03em; text-transform: uppercase; }
    ::ng-deep .pl-gradient { height: 10px; border-radius: 5px; margin-bottom: .5rem; background: linear-gradient(90deg,#d1fae5,#34d399,#059669,#065f46); }
    ::ng-deep .pl-labels { display: flex; justify-content: space-between; font-size: .65rem; color: #94a3b8; }

    /* ── RESPONSIVE ────────────────────────────────────────────── */
    @media (max-width: 1024px) {
      .metrics-inner { grid-template-columns: repeat(2,1fr); }
      .fstrip-inner { flex-wrap: wrap; }
      .fsi { min-width: 45%; }
      .fsi-div:nth-child(4) { display: none; }
    }
    @media (max-width: 768px) {
      .explorer-section { flex-direction: column; height: auto; }
      .map-panel { height: 400px; }
      .info-panel { width: 100%; max-height: 360px; }
      .hero-kpis { flex-wrap: wrap; justify-content: center; gap: 1.25rem; padding: 1rem 1.5rem; }
      .hkpi-sep { display: none; }
      .fstrip-inner { flex-direction: column; align-items: stretch; }
      .fsi-div { display: none; }
      .fsi { padding: 1rem; }
      .cs-head { flex-direction: column; }
      .csh-top3 { justify-content: flex-start; }
      .metrics-inner { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .metrics-inner { grid-template-columns: 1fr; }
      .cards-grid { grid-template-columns: 1fr; }
      .ctaf-btns { flex-direction: column; }
    }
    `]
})
export class RegionsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

    private regionService = inject(RegionService);
    private vendorService = inject(VendorService);
    private map!: L.Map;
    private zoneLayers = new Map<number, L.Circle>();
    private dotLayers = new Map<number, L.CircleMarker>();
    private vendorMarkers: L.Marker[] = [];
    private mapReady = false;
    private dataReady = false;

    regions = signal<RegionDisplay[]>([]);
    isLoading = signal(true);
    selectedRegion = signal<RegionDisplay | null>(null);
    stats = signal({ totalRegions: 0, activeRegions: 0, totalVendors: 0, totalProducts: 0 });

    get topRegions(): RegionDisplay[] {
        return [...this.regions()]
            .sort((a, b) => b.productCount - a.productCount)
            .slice(0, 3);
    }

    ngOnInit() {
        this.loadRegions();
        this.loadVendors();
    }

    ngAfterViewInit() {
        setTimeout(() => this.initMap(), 80);
    }

    ngOnDestroy() {
        if (this.map) this.map.remove();
    }

    private initMap() {
        this.map = L.map(this.mapEl.nativeElement, {
            center: [12.36, -1.53],
            zoom: 6,
            zoomControl: false,
            scrollWheelZoom: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        L.control.zoom({ position: 'topright' }).addTo(this.map);

        this.mapReady = true;
        requestAnimationFrame(() => {
            this.map.invalidateSize({ animate: false });
        });

        if (this.dataReady) this.buildLayers();
    }

    private loadRegions() {
        this.isLoading.set(true);
        this.regionService.getRegions().subscribe({
            next: (regions) => {
                const enriched: RegionDisplay[] = regions.map(r => ({
                    ...r,
                    population: r.population ?? 0,
                    area: r.area ?? 0,
                    vendorCount: VENDOR_COUNTS[r.id] ?? 5,
                    productCount: PRODUCT_COUNTS[r.id] ?? 30,
                    deliveryFee: r.deliveryFee ?? 1500,
                    isActive: r.isActive ?? true
                }));
                this.regions.set(enriched);
                this.calculateStats(enriched);
                this.isLoading.set(false);
                this.dataReady = true;
                if (this.mapReady) this.buildLayers();
            },
            error: () => this.isLoading.set(false)
        });
    }

    private buildLayers() {
        const list = this.regions();
        const maxProd = Math.max(...list.map(r => r.productCount));
        const maxArea = Math.max(...list.map(r => r.area));

        list.forEach(r => {
            if (!r.coordinates) return;
            const latlng: L.LatLngExpression = [r.coordinates.lat, r.coordinates.lng];
            const color = this.productionColor(r.productCount, maxProd);
            const pct = maxProd > 0 ? (r.productCount / maxProd) * 100 : 0;

            const zoneR = 18000 + Math.sqrt(r.area / maxArea) * 60000;
            const zone = L.circle(latlng, {
                radius: zoneR,
                fillColor: color,
                color: color,
                weight: 1.5,
                fillOpacity: 0.18,
                opacity: 0.45
            });

            zone.bindTooltip(this.buildTooltip(r, color, pct), {
                sticky: true,
                direction: 'top',
                offset: [0, -16],
                className: 'rtt',
                opacity: 1
            });

            zone.on('mouseover', () => {
                zone.setStyle({ fillOpacity: 0.38, weight: 2.5, opacity: 0.8 });
            });
            zone.on('mouseout', () => {
                const isSelected = this.selectedRegion()?.id === r.id;
                zone.setStyle({
                    fillOpacity: isSelected ? 0.32 : 0.18,
                    weight: isSelected ? 2.5 : 1.5,
                    opacity: isSelected ? 0.8 : 0.45
                });
            });
            zone.on('click', () => this.selectRegion(r));
            zone.addTo(this.map);
            this.zoneLayers.set(r.id, zone);

            const dot = L.circleMarker(latlng, {
                radius: 7,
                fillColor: '#ffffff',
                color: color,
                weight: 3,
                fillOpacity: 1,
                interactive: false
            }).addTo(this.map);
            this.dotLayers.set(r.id, dot);
        });

        this.addLegend(maxProd);
    }

    private addLegend(maxProd: number) {
        const ctrl = new L.Control({ position: 'bottomleft' });
        ctrl.onAdd = () => {
            const div = L.DomUtil.create('div', 'prod-legend');
            div.innerHTML = `
              <div class="pl-title">Intensité production</div>
              <div class="pl-gradient"></div>
              <div class="pl-labels">
                <span>Faible</span>
                <span>Max: ${maxProd} produits</span>
              </div>`;
            return div;
        };
        ctrl.addTo(this.map);
    }

    private buildTooltip(r: RegionDisplay, color: string, pct: number): string {
        const fee = r.deliveryFee?.toLocaleString('fr-FR') ?? '—';
        const pop = r.population > 0 ? (r.population / 1_000_000).toFixed(2) + 'M' : '—';
        const density = r.area > 0 ? (r.productCount / r.area * 1000).toFixed(1) : '—';
        const barW = Math.round(pct);
        return `
          <div class="rtt-card">
            <div class="rtt-head" style="background:${color}">
              <span class="rtt-title">${r.name}</span>
              <span class="rtt-sub">📍 ${r.capital} · ${(r.provinces ?? []).length} provinces</span>
            </div>
            <div class="rtt-body">
              <div class="rtt-kpis">
                <div class="rtt-kpi k1">
                  <span class="rtt-kv" style="color:#059669">${r.vendorCount}</span>
                  <span class="rtt-kl">Vendeurs actifs</span>
                </div>
                <div class="rtt-kpi k2">
                  <span class="rtt-kv" style="color:#3b82f6">${r.productCount}</span>
                  <span class="rtt-kl">Produits listés</span>
                </div>
                <div class="rtt-kpi k3">
                  <span class="rtt-kv" style="color:#d97706">${pop}</span>
                  <span class="rtt-kl">Population</span>
                </div>
                <div class="rtt-kpi k4">
                  <span class="rtt-kv" style="color:#7c3aed">${density}</span>
                  <span class="rtt-kl">Densité prod./km²</span>
                </div>
              </div>
              <div class="rtt-bar-wrap">
                <div class="rtt-bar-lbl">Intensité de production — ${barW}%</div>
                <div class="rtt-bar-track">
                  <div class="rtt-bar-fill" style="width:${barW}%;background:${color}"></div>
                </div>
              </div>
              <div class="rtt-footer">🚚 Livraison: ${fee} FCFA · Surface: ${r.area.toLocaleString('fr-FR')} km²</div>
            </div>
          </div>`;
    }

    selectRegion(region: RegionDisplay) {
        const prev = this.selectedRegion();
        if (prev) {
            const pz = this.zoneLayers.get(prev.id);
            if (pz) pz.setStyle({ fillOpacity: 0.18, weight: 1.5, opacity: 0.45 });
        }

        this.selectedRegion.set(region);

        const zone = this.zoneLayers.get(region.id);
        if (zone) zone.setStyle({ fillOpacity: 0.38, weight: 2.5, opacity: 0.8 });

        if (region.coordinates && this.map) {
            this.map.flyTo([region.coordinates.lat, region.coordinates.lng], 9, { duration: 1.1 });
        }
    }

    private loadVendors() {
        this.vendorService.getVendors().subscribe({
            next: (vendors) => {
                if (this.mapReady) {
                    this.buildVendorMarkers(vendors);
                } else {
                    const interval = setInterval(() => {
                        if (this.mapReady) {
                            clearInterval(interval);
                            this.buildVendorMarkers(vendors);
                        }
                    }, 100);
                }
            }
        });
    }

    private buildVendorMarkers(vendors: any[]) {
        vendors.forEach(v => {
            const lat = v.location?.coordinates?.lat;
            const lng = v.location?.coordinates?.lng;
            if (!lat || !lng) return;

            const prod = PRODUCTION[v.id];
            const initial = (v.shopName || 'V').charAt(0).toUpperCase();

            const icon = L.divIcon({
                html: `<div class="vpin">
                         <div class="vpin-body">${initial}</div>
                         <div class="vpin-tip"></div>
                         <div class="vpin-shadow"></div>
                       </div>`,
                className: '',
                iconSize: [34, 46],
                iconAnchor: [17, 46],
                tooltipAnchor: [0, -48]
            });

            const marker = L.marker([lat, lng], { icon });

            marker.bindTooltip(this.buildVendorTooltip(v, prod), {
                direction: 'top',
                offset: [0, -4],
                className: 'vtt',
                opacity: 1,
                sticky: false
            });

            marker.addTo(this.map);
            this.vendorMarkers.push(marker);
        });
    }

    private buildVendorTooltip(v: any, prod: typeof PRODUCTION[number] | undefined): string {
        const stars = Math.round(v.rating ?? 0);
        const starHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
        const cropsHtml = (prod?.crops ?? [v.category]).map(c =>
            `<span class="vtc">${c}</span>`
        ).join('');
        const areaLine = prod?.area
            ? `<div class="vtt-row"><span>📐</span><span>${prod.area}</span></div>`
            : '';
        return `
          <div class="vtt-card">
            <div class="vtt-head">
              <div class="vtt-type">${prod?.type ?? v.category}</div>
              <div class="vtt-name">${v.shopName}</div>
              <div class="vtt-loc">📍 ${v.location?.city ?? ''}</div>
            </div>
            <div class="vtt-body">
              <div class="vtt-crops">${cropsHtml}</div>
              <div class="vtt-output">
                <span class="vto-v">${prod?.output ?? '—'}</span>
                <span class="vto-l">Production annuelle</span>
              </div>
              ${areaLine}
              <div class="vtt-footer">
                <span class="vtt-stars">${starHtml}</span>
                <span class="vtt-rating">${v.rating ?? '—'} · ${v.reviewCount ?? 0} avis</span>
              </div>
            </div>
          </div>`;
    }

    getRegionColor(region: Region | null): string {
        if (!region) return '#10b981';
        const list = this.regions();
        if (!list.length) return '#10b981';
        const max = Math.max(...list.map(r => r.productCount));
        return this.productionColor((region as RegionDisplay).productCount ?? 0, max);
    }

    getProductionPct(region: RegionDisplay): number {
        const list = this.regions();
        if (!list.length) return 0;
        const max = Math.max(...list.map(r => r.productCount));
        return max > 0 ? Math.round((region.productCount / max) * 100) : 0;
    }

    private productionColor(count: number, max: number): string {
        const t = max > 0 ? count / max : 0;
        const stops: [number, number, number][] = [
            [209, 250, 229],
            [167, 243, 208],
            [52, 211, 153],
            [16, 185, 129],
            [5, 150, 105],
            [4, 120, 87],
            [6, 95, 70]
        ];
        const idx = t * (stops.length - 1);
        const i = Math.min(Math.floor(idx), stops.length - 2);
        const f = idx - i;
        const [r1, g1, b1] = stops[i];
        const [r2, g2, b2] = stops[i + 1];
        return `rgb(${Math.round(r1 + f * (r2 - r1))},${Math.round(g1 + f * (g2 - g1))},${Math.round(b1 + f * (b2 - b1))})`;
    }

    private calculateStats(regions: RegionDisplay[]) {
        this.stats.set({
            totalRegions: regions.length,
            activeRegions: regions.filter(r => r.isActive).length,
            totalVendors: regions.reduce((s, r) => s + r.vendorCount, 0),
            totalProducts: regions.reduce((s, r) => s + r.productCount, 0)
        });
    }
}
