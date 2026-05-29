import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  activeTab: 'login' | 'register' | 'verify' = 'login';
  loading = false;
  pendingPhone = '';
  devCode: string | null = null;

  readonly loginForm = this.fb.nonNullable.group({
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [true]
  });

  readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    company: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordsMatch
  });

  readonly verifyForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  setTab(tab: 'login' | 'register' | 'verify'): void {
    if (this.loading) return;
    this.activeTab = tab;
  }

  submitLogin(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { telefono, password } = this.loginForm.getRawValue();

    this.authService.login({ telefono: telefono.trim(), password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sesion iniciada',
          detail: 'Bienvenido al sistema'
        });
        this.redirectByRole(response.data.user.role);
      },
      error: (error) => {
        this.loading = false;
        if (error?.error?.error?.code === 'PHONE_NOT_VERIFIED') {
          this.pendingPhone = telefono.trim();
          this.activeTab = 'verify';
        }
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo iniciar sesion',
          detail: error?.error?.error?.message || 'Revisa el telefono y la contrasena'
        });
      }
    });
  }

  submitRegister(): void {
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { firstName, lastName, company, phone, password } = this.registerForm.getRawValue();
    const telefono = phone.trim();

    this.authService.register({
      nombre: firstName.trim(),
      apellido: lastName.trim(),
      empresaTransporte: company.trim(),
      telefono,
      password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.pendingPhone = response.telefono || response.data.telefono;
        this.devCode = response.data.verification?.devCode || null;
        this.verifyForm.reset();
        this.activeTab = 'verify';
        this.messageService.add({
          severity: 'success',
          summary: 'Codigo enviado',
          detail: 'Revisa tu WhatsApp para confirmar la cuenta'
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo registrar',
          detail: error?.error?.error?.message || 'Revisa el numero de telefono'
        });
      }
    });
  }

  submitVerification(): void {
    if (this.verifyForm.invalid || !this.pendingPhone || this.loading) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { code } = this.verifyForm.getRawValue();

    this.authService.verifyPhone({ telefono: this.pendingPhone, code: code.trim() }).subscribe({
      next: () => {
        this.loading = false;
        this.loginForm.patchValue({ telefono: this.pendingPhone });
        this.activeTab = 'login';
        this.messageService.add({
          severity: 'success',
          summary: 'Cuenta verificada',
          detail: 'Ahora puedes iniciar sesion'
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Codigo invalido',
          detail: error?.error?.error?.message || 'Solicita un nuevo codigo si expiro'
        });
      }
    });
  }

  resendCode(): void {
    if (!this.pendingPhone || this.loading) return;

    this.loading = true;
    this.authService.resendCode(this.pendingPhone).subscribe({
      next: (response) => {
        this.loading = false;
        this.devCode = response.data.verification?.devCode || null;
        this.messageService.add({
          severity: 'success',
          summary: 'Codigo reenviado',
          detail: 'Te enviamos un nuevo codigo por WhatsApp'
        });
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo reenviar',
          detail: error?.error?.error?.message || 'Intenta nuevamente'
        });
      }
    });
  }

  loginHasError(controlName: 'telefono' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  registerHasError(controlName: keyof typeof this.registerForm.controls): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  verifyHasError(controlName: keyof typeof this.verifyForm.controls): boolean {
    const control = this.verifyForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  private redirectByRole(role: number): void {
    this.router.navigate([role === 1 ? '/admin' : '/dashboard']);
  }
}
