import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="dashboard">
      <div class="welcome">
        <span class="eyebrow">Resumen general</span>
        <h1>Bienvenido, {{ auth.user()?.name }}</h1>
        <p>Gestiona la operación de {{ auth.user()?.empresa || 'tu empresa' }} desde un solo lugar.</p>
      </div>

      <div class="module-grid">
        <a routerLink="/vehiculos" class="module-card">
          <span class="module-icon"><i class="pi pi-truck"></i></span>
          <span class="module-copy"><strong>Vehículos</strong><small>Consulta la flota y registra nuevas unidades</small></span>
          <i class="pi pi-arrow-right"></i>
        </a>
        <article class="module-card disabled">
          <span class="module-icon"><i class="pi pi-calendar"></i></span>
          <span class="module-copy"><strong>Jornadas</strong><small>Próximamente</small></span>
        </article>
        <article class="module-card disabled">
          <span class="module-icon"><i class="pi pi-wrench"></i></span>
          <span class="module-copy"><strong>Mantenimientos</strong><small>Próximamente</small></span>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .dashboard { max-width: 1200px; margin: 0 auto; }
    .welcome { padding: 30px; border: 1px solid #dbe4f0; border-radius: 16px; background: linear-gradient(135deg, #fff 0%, #eef4ff 100%); }
    .eyebrow { color: #2563eb; font-size: .78rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 10px 0 8px; font-size: 2rem; }
    p { margin: 0; color: var(--app-muted); }
    .module-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 22px; }
    .module-card { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; padding: 20px; border: 1px solid #e2e7ef; border-radius: 14px; background: #fff; color: inherit; text-decoration: none; transition: border-color .2s, transform .2s; }
    a.module-card:hover { border-color: #2563eb; transform: translateY(-2px); }
    .module-card.disabled { color: #98a2b3; }
    .module-icon { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: #e8efff; color: #2563eb; font-size: 1.1rem; }
    .disabled .module-icon { background: #f2f4f7; color: #98a2b3; }
    .module-copy { display: grid; gap: 4px; }
    .module-copy small { color: var(--app-muted); }
  `]
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
