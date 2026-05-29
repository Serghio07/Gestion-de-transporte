import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule],
  template: `
    <main class="dashboard-page">
      <p-card>
        <div class="dashboard-header">
          <div>
            <p-tag value="Sesion activa" severity="success"></p-tag>
            <h1>Bienvenido, {{ auth.user()?.name }}</h1>
            <p>El login con JWT ya esta conectado al backend.</p>
          </div>
          <button pButton type="button" icon="pi pi-sign-out" label="Salir" severity="secondary" (click)="auth.logout()"></button>
        </div>
      </p-card>
    </main>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: var(--surface-ground);
    }

    p-card {
      width: min(760px, 100%);
    }

    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
    }

    h1 {
      margin: 16px 0 8px;
      font-size: 1.65rem;
    }

    p {
      margin: 0;
      color: var(--app-muted);
    }

    @media (max-width: 640px) {
      .dashboard-header {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
