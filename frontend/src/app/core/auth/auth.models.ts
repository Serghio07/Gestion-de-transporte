export interface LoginRequest {
  telefono: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  empresaTransporte: string;
  telefono: string;
  password: string;
}

export interface VerifyPhoneRequest {
  telefono: string;
  code: string;
}

export interface AuthUser {
  id: number;
  name: string;
  telefono: string;
  empresa: string;
  foto_url: string | null;
  role: number;
  permissions: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    expiresIn: number;
    sessionId: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  requiresVerification: boolean;
  telefono: string;
  data: {
    id: number;
    nombre: string;
    apellido: string;
    empresaTransporte: string;
    telefono: string;
    rol_id: number;
    verification?: {
      expiresAt: string;
      devCode?: string;
    };
  };
}

export interface SessionInfo {
  id: string;
  token_jti: string;
  device_info: string | null;
  ip_address: string | null;
  ultimo_acceso: string;
  expira_en: string;
  creado_en: string;
}
