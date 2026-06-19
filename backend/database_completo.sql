-- ==============================================================================
-- SISTEMA DE GESTION DE TRANSPORTE - ESQUEMA POSTGRESQL
-- PostgreSQL 12+
--
-- Este script esta pensado para inicializar una base limpia en PostgreSQL.
-- Mantiene compatibilidad con el backend Node/Sequelize actual y agrega reglas
-- de integridad para evitar datos operativos y financieros incoherentes.
-- ==============================================================================

BEGIN;

-- ============================================================================
-- 1. EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 2. FUNCIONES AUXILIARES BASE
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_limpiar_tokens_expirados()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM token_blacklist
     WHERE expira_en < CURRENT_TIMESTAMP;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_limpiar_sesiones_expiradas()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM sesiones_activas
     WHERE expira_en < CURRENT_TIMESTAMP
        OR activa = false;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. TABLAS DE SEGURIDAD Y ACCESO
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL UNIQUE,
    descripcion     TEXT,
    creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresas (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL UNIQUE,
    telefono        VARCHAR(30),
    activo          BOOLEAN NOT NULL DEFAULT true,
    creado_por_id   INTEGER,
    creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
    id                    SERIAL PRIMARY KEY,
    nombre                VARCHAR(100) NOT NULL UNIQUE,
    password_hash         VARCHAR(255) NOT NULL,
    pin_acceso            VARCHAR(10),
    email                 VARCHAR(100) UNIQUE,
    foto_url              VARCHAR(500),
    apellido              VARCHAR(100),
    empresa_transporte    VARCHAR(150),
    telefono              VARCHAR(30) UNIQUE,
    telefono_verificado_en TIMESTAMP,
    empresa_id            INTEGER REFERENCES empresas(id) ON DELETE SET NULL,
    rol_id                INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    activo                BOOLEAN NOT NULL DEFAULT true,

    -- Campos usados por el backend actual y por auditoria de acceso.
    token_sesion_activo   VARCHAR(500),
    ultimo_acceso         TIMESTAMP,
    intentos_fallidos     SMALLINT NOT NULL DEFAULT 0,
    bloqueado_hasta       TIMESTAMP,
    ultimo_login          TIMESTAMP,
    password_cambiado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    creado_en             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_email_formato CHECK (
        email IS NULL OR email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    ),
    CONSTRAINT chk_usuario_intentos_no_negativo CHECK (intentos_fallidos >= 0)
);

CREATE TABLE IF NOT EXISTS token_blacklist (
    id          SERIAL PRIMARY KEY,
    token       TEXT NOT NULL UNIQUE,
    usuario_id  INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    expira_en   TIMESTAMP NOT NULL,
    razon       VARCHAR(100) NOT NULL DEFAULT 'logout',
    creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sesiones_activas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token_jti       VARCHAR(255) NOT NULL UNIQUE,
    device_info     VARCHAR(500),
    ip_address      INET,
    ultimo_acceso   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expira_en       TIMESTAMP NOT NULL,
    activa          BOOLEAN NOT NULL DEFAULT true,
    creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_sesion_expira_futuro CHECK (expira_en > creado_en)
);

-- ============================================================================
-- 4. VEHICULOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS vehiculos (
    id                  SERIAL PRIMARY KEY,
    empresa_id          INTEGER REFERENCES empresas(id) ON DELETE SET NULL,
    unidad_nro          VARCHAR(50) NOT NULL UNIQUE,
    tipo                VARCHAR(50) NOT NULL,
    placa_serie         VARCHAR(50) UNIQUE,
    marca               VARCHAR(100),
    modelo              VARCHAR(100),
    anio                SMALLINT,
    color               VARCHAR(50),
    foto_url            TEXT,
    conductor_id        INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    uso_total_horas     INTERVAL NOT NULL DEFAULT INTERVAL '0 hours',
    activo              BOOLEAN NOT NULL DEFAULT true,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_vehiculo_anio CHECK (anio IS NULL OR (anio BETWEEN 1950 AND 2100)),
    CONSTRAINT chk_uso_total_horas_no_negativo CHECK (uso_total_horas >= INTERVAL '0 seconds')
);

-- ============================================================================
-- 5. JORNADAS
-- ============================================================================

CREATE TABLE IF NOT EXISTS jornadas (
    id                      SERIAL PRIMARY KEY,
    usuario_id              INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    vehiculo_id             INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE RESTRICT,
    estado                  VARCHAR(20) NOT NULL DEFAULT 'activa',

    fecha_hora_inicio       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_hora_cierre       TIMESTAMP,
    duracion_jornada        INTERVAL,

    capital_recibido        DECIMAL(15,2) NOT NULL DEFAULT 0,
    viaticos_entregados     DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_gastos            DECIMAL(15,2) NOT NULL DEFAULT 0,
    saldo_rendido           DECIMAL(15,2),
    diferencia_caja         DECIMAL(15,2),

    aprobado_por_id         INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    aprobado_en             TIMESTAMP,

    gps_inicio              VARCHAR(100),
    gps_final               VARCHAR(100),

    odometro_inicio         DECIMAL(10,1),
    odometro_fin            DECIMAL(10,1),
    km_recorridos           DECIMAL(10,1) GENERATED ALWAYS AS (
                                CASE
                                    WHEN odometro_fin IS NOT NULL AND odometro_inicio IS NOT NULL
                                    THEN odometro_fin - odometro_inicio
                                    ELSE NULL
                                END
                            ) STORED,

    observaciones           TEXT,
    creado_en               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_estado_jornada CHECK (estado IN ('activa', 'cerrada', 'cancelada')),
    CONSTRAINT chk_fechas_jornada CHECK (
        fecha_hora_cierre IS NULL OR fecha_hora_cierre >= fecha_hora_inicio
    ),
    CONSTRAINT chk_montos_jornada_no_negativos CHECK (
        capital_recibido >= 0
        AND viaticos_entregados >= 0
        AND total_gastos >= 0
        AND (saldo_rendido IS NULL OR saldo_rendido >= 0)
    ),
    CONSTRAINT chk_odometro_jornada CHECK (
        (odometro_inicio IS NULL OR odometro_inicio >= 0)
        AND (odometro_fin IS NULL OR odometro_fin >= 0)
        AND (
            odometro_inicio IS NULL
            OR odometro_fin IS NULL
            OR odometro_fin >= odometro_inicio
        )
    ),
    CONSTRAINT chk_aprobacion_jornada CHECK (
        (aprobado_por_id IS NULL AND aprobado_en IS NULL)
        OR (aprobado_por_id IS NOT NULL AND aprobado_en IS NOT NULL AND estado = 'cerrada')
    )
);

-- ============================================================================
-- 6. REGISTRO DIARIO Y OPERACIONES
-- ============================================================================

CREATE TABLE IF NOT EXISTS actividades_gastos (
    id                      SERIAL PRIMARY KEY,
    jornada_id              INTEGER NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
    tipo_actividad          VARCHAR(100) NOT NULL,
    monto_gastado           DECIMAL(12,2) NOT NULL,
    cantidad_unidades       DECIMAL(10,2),
    proveedor_lugar         VARCHAR(255),
    foto_comprobante_url    VARCHAR(500),
    fecha_registro          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_actividad_monto_positivo CHECK (monto_gastado > 0),
    CONSTRAINT chk_actividad_cantidad_positiva CHECK (
        cantidad_unidades IS NULL OR cantidad_unidades > 0
    )
);

CREATE TABLE IF NOT EXISTS checklist_diario (
    id                  SERIAL PRIMARY KEY,
    jornada_id          INTEGER NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,

    llantas_ok          BOOLEAN NOT NULL DEFAULT false,
    luces_ok            BOOLEAN NOT NULL DEFAULT false,
    frenos_ok           BOOLEAN NOT NULL DEFAULT false,
    niveles_ok          BOOLEAN NOT NULL DEFAULT false,
    extintor_ok         BOOLEAN NOT NULL DEFAULT false,
    documentos_ok       BOOLEAN NOT NULL DEFAULT false,
    cinturones_ok       BOOLEAN NOT NULL DEFAULT false,

    firma_conductor     VARCHAR(255),
    foto_estado_url     VARCHAR(500),
    comentarios         TEXT,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_checklist_jornada UNIQUE (jornada_id)
);

CREATE TABLE IF NOT EXISTS mantenimiento_vida_util (
    id                          SERIAL PRIMARY KEY,
    vehiculo_id                 INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
    fecha_servicio              DATE NOT NULL,
    tipo_servicio               VARCHAR(100) NOT NULL,
    tipo_mantenimiento          VARCHAR(100),
    descripcion                 TEXT,
    fecha_inicio                TIMESTAMP,
    horometro_servicio          DECIMAL(12,2),
    horometro_realizado         DECIMAL(12,2),
    proximo_mantenimiento_h     DECIMAL(12,2),
    costo_total                 DECIMAL(12,2),
    costo                       DECIMAL(12,2),
    proveedor                   VARCHAR(255),
    foto_factura_url            VARCHAR(500),
    estado                      VARCHAR(30) NOT NULL DEFAULT 'realizado',
    notas                       TEXT,
    observaciones               TEXT,
    realizado_por_id            INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en                   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_mantenimiento_valores CHECK (
        (horometro_servicio IS NULL OR horometro_servicio >= 0)
        AND (horometro_realizado IS NULL OR horometro_realizado >= 0)
        AND (proximo_mantenimiento_h IS NULL OR proximo_mantenimiento_h >= 0)
        AND (costo_total IS NULL OR costo_total >= 0)
        AND (costo IS NULL OR costo >= 0)
    ),
    CONSTRAINT chk_mantenimiento_estado CHECK (
        estado IN ('programado', 'en_proceso', 'realizado', 'cancelado')
    )
);

CREATE TABLE IF NOT EXISTS anticipos (
    id              SERIAL PRIMARY KEY,
    jornada_id      INTEGER NOT NULL REFERENCES jornadas(id) ON DELETE CASCADE,
    monto           DECIMAL(12,2) NOT NULL,
    concepto        VARCHAR(255),
    entregado_por   INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_anticipo_positivo CHECK (monto > 0)
);

CREATE TABLE IF NOT EXISTS alertas_mantenimiento (
    id                  SERIAL PRIMARY KEY,
    vehiculo_id         INTEGER NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
    tipo_alerta         VARCHAR(50) NOT NULL DEFAULT 'preventivo',
    descripcion         TEXT,
    horas_actuales      DECIMAL(12,2),
    horas_limite        DECIMAL(12,2),
    horas_restantes     DECIMAL(12,2),
    urgencia            VARCHAR(20) NOT NULL DEFAULT 'media',
    resuelta            BOOLEAN NOT NULL DEFAULT false,
    resuelta_en         TIMESTAMP,
    resuelta_por_id     INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_tipo_alerta CHECK (tipo_alerta IN ('preventivo', 'vencido', 'critico')),
    CONSTRAINT chk_urgencia CHECK (urgencia IN ('alta', 'media', 'baja')),
    CONSTRAINT chk_alerta_resolucion CHECK (
        (resuelta = false AND resuelta_en IS NULL)
        OR (resuelta = true AND resuelta_en IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS historial_cambios (
    id                  BIGSERIAL PRIMARY KEY,
    tabla_afectada      VARCHAR(100) NOT NULL,
    registro_id         INTEGER NOT NULL,
    operacion           VARCHAR(10) NOT NULL,
    usuario_db          VARCHAR(100) NOT NULL DEFAULT current_user,
    valor_anterior      JSONB,
    valor_nuevo         JSONB,
    campos_modificados  TEXT[],
    ip_origen           INET,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_operacion CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE TABLE IF NOT EXISTS reportes_pdf (
    id                  SERIAL PRIMARY KEY,
    nombre_archivo      VARCHAR(255) NOT NULL,
    tipo_reporte        VARCHAR(50),
    fecha_desde         DATE NOT NULL,
    fecha_hasta         DATE NOT NULL,
    generado_por_id     INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    url_descarga        VARCHAR(500),
    resumen_json        JSONB,
    creado_en           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rango_reporte CHECK (fecha_hasta >= fecha_desde)
);

-- ============================================================================
-- 7. INDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_token_blacklist_token      ON token_blacklist(token);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_usuario_id ON token_blacklist(usuario_id);
CREATE INDEX IF NOT EXISTS idx_token_blacklist_expira_en  ON token_blacklist(expira_en);

CREATE INDEX IF NOT EXISTS idx_usuarios_email             ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol_id            ON usuarios(rol_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_bloqueado_hasta   ON usuarios(bloqueado_hasta) WHERE bloqueado_hasta IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario_id        ON sesiones_activas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_token_jti         ON sesiones_activas(token_jti);
CREATE INDEX IF NOT EXISTS idx_sesiones_activa            ON sesiones_activas(activa) WHERE activa = true;
CREATE INDEX IF NOT EXISTS idx_sesiones_expira_en         ON sesiones_activas(expira_en);

CREATE INDEX IF NOT EXISTS idx_jornadas_usuario_id        ON jornadas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_jornadas_vehiculo_id       ON jornadas(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_jornadas_estado            ON jornadas(estado);
CREATE INDEX IF NOT EXISTS idx_jornadas_fecha_inicio      ON jornadas(fecha_hora_inicio);
CREATE INDEX IF NOT EXISTS idx_jornadas_aprobado_por      ON jornadas(aprobado_por_id) WHERE aprobado_por_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_actividades_jornada_id     ON actividades_gastos(jornada_id);
CREATE INDEX IF NOT EXISTS idx_checklist_jornada_id       ON checklist_diario(jornada_id);
CREATE INDEX IF NOT EXISTS idx_anticipos_jornada_id       ON anticipos(jornada_id);

CREATE INDEX IF NOT EXISTS idx_mantenimiento_vehiculo_id  ON mantenimiento_vida_util(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_mantenimiento_fecha        ON mantenimiento_vida_util(fecha_servicio);

CREATE INDEX IF NOT EXISTS idx_alertas_vehiculo_id        ON alertas_mantenimiento(vehiculo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_resuelta           ON alertas_mantenimiento(resuelta) WHERE resuelta = false;
CREATE INDEX IF NOT EXISTS idx_alertas_urgencia           ON alertas_mantenimiento(urgencia);

CREATE INDEX IF NOT EXISTS idx_historial_tabla_registro   ON historial_cambios(tabla_afectada, registro_id);
CREATE INDEX IF NOT EXISTS idx_historial_creado_en        ON historial_cambios(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_historial_operacion        ON historial_cambios(operacion);

CREATE INDEX IF NOT EXISTS idx_reportes_generado_por_id   ON reportes_pdf(generado_por_id);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha_desde       ON reportes_pdf(fecha_desde);

-- ============================================================================
-- 8. FUNCIONES DE LOGICA DE NEGOCIO
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_recalcular_finanzas_jornada(p_jornada_id INTEGER)
RETURNS VOID AS $$
DECLARE
    v_total_gastos    DECIMAL(15,2);
    v_total_anticipos DECIMAL(15,2);
BEGIN
    SELECT COALESCE(SUM(monto_gastado), 0)
      INTO v_total_gastos
      FROM actividades_gastos
     WHERE jornada_id = p_jornada_id;

    SELECT COALESCE(SUM(monto), 0)
      INTO v_total_anticipos
      FROM anticipos
     WHERE jornada_id = p_jornada_id;

    UPDATE jornadas
       SET total_gastos = v_total_gastos,
           diferencia_caja = (capital_recibido + viaticos_entregados + v_total_anticipos) - v_total_gastos
     WHERE id = p_jornada_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_validar_jornada_activa()
RETURNS TRIGGER AS $$
DECLARE
    v_estado VARCHAR(20);
    v_jornada_id INTEGER;
BEGIN
    v_jornada_id = COALESCE(NEW.jornada_id, OLD.jornada_id);

    SELECT estado
      INTO v_estado
      FROM jornadas
     WHERE id = v_jornada_id;

    IF v_estado IS NULL THEN
        RAISE EXCEPTION 'La jornada % no existe', v_jornada_id;
    END IF;

    IF v_estado <> 'activa' THEN
        RAISE EXCEPTION 'No se puede modificar registros diarios de una jornada %', v_estado;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_cerrar_jornada_automatico()
RETURNS TRIGGER AS $$
DECLARE
    v_horas_actuales     DECIMAL(12,2);
    v_prox_mant          DECIMAL(12,2);
    v_horas_restantes    DECIMAL(12,2);
    v_urgencia           VARCHAR(20);
BEGIN
    IF NEW.estado = 'cerrada' AND OLD.estado = 'activa' THEN
        NEW.fecha_hora_cierre = COALESCE(NEW.fecha_hora_cierre, CURRENT_TIMESTAMP);
        NEW.duracion_jornada = NEW.fecha_hora_cierre - NEW.fecha_hora_inicio;

        IF NEW.duracion_jornada < INTERVAL '0 seconds' THEN
            RAISE EXCEPTION 'La fecha de cierre no puede ser anterior al inicio';
        END IF;

        SELECT COALESCE(SUM(monto_gastado), 0)
          INTO NEW.total_gastos
          FROM actividades_gastos
         WHERE jornada_id = NEW.id;

        SELECT (NEW.capital_recibido + NEW.viaticos_entregados + COALESCE(SUM(monto), 0)) - NEW.total_gastos
          INTO NEW.diferencia_caja
          FROM anticipos
         WHERE jornada_id = NEW.id;

        UPDATE vehiculos
           SET uso_total_horas = uso_total_horas + NEW.duracion_jornada
         WHERE id = NEW.vehiculo_id;

        SELECT EXTRACT(EPOCH FROM v.uso_total_horas) / 3600,
               m.proximo_mantenimiento_h
          INTO v_horas_actuales,
               v_prox_mant
          FROM vehiculos v
          LEFT JOIN LATERAL (
              SELECT proximo_mantenimiento_h
                FROM mantenimiento_vida_util
               WHERE vehiculo_id = v.id
                 AND proximo_mantenimiento_h IS NOT NULL
               ORDER BY fecha_servicio DESC, id DESC
               LIMIT 1
          ) m ON true
         WHERE v.id = NEW.vehiculo_id;

        IF v_prox_mant IS NOT NULL THEN
            v_horas_restantes = v_prox_mant - v_horas_actuales;
            v_urgencia = CASE
                WHEN v_horas_restantes <= 10 THEN 'alta'
                WHEN v_horas_restantes <= 50 THEN 'media'
                ELSE 'baja'
            END;

            IF v_urgencia IN ('alta', 'media')
               AND NOT EXISTS (
                   SELECT 1
                     FROM alertas_mantenimiento
                    WHERE vehiculo_id = NEW.vehiculo_id
                      AND resuelta = false
               )
            THEN
                INSERT INTO alertas_mantenimiento (
                    vehiculo_id,
                    tipo_alerta,
                    descripcion,
                    horas_actuales,
                    horas_limite,
                    horas_restantes,
                    urgencia
                )
                VALUES (
                    NEW.vehiculo_id,
                    CASE WHEN v_horas_restantes <= 0 THEN 'vencido' ELSE 'preventivo' END,
                    'Mantenimiento programado detectado al cerrar jornada #' || NEW.id,
                    v_horas_actuales,
                    v_prox_mant,
                    v_horas_restantes,
                    v_urgencia
                );
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_registrar_historial()
RETURNS TRIGGER AS $$
DECLARE
    v_campos_mod TEXT[];
    v_key        TEXT;
    v_old_val    TEXT;
    v_new_val    TEXT;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        v_campos_mod = ARRAY[]::TEXT[];

        FOR v_key IN SELECT key FROM jsonb_each_text(to_jsonb(NEW)) LOOP
            v_old_val = (to_jsonb(OLD) ->> v_key);
            v_new_val = (to_jsonb(NEW) ->> v_key);

            IF v_old_val IS DISTINCT FROM v_new_val THEN
                v_campos_mod = array_append(v_campos_mod, v_key);
            END IF;
        END LOOP;
    END IF;

    INSERT INTO historial_cambios (
        tabla_afectada,
        registro_id,
        operacion,
        valor_anterior,
        valor_nuevo,
        campos_modificados
    )
    VALUES (
        TG_TABLE_NAME,
        CASE TG_OP WHEN 'DELETE' THEN OLD.id ELSE NEW.id END,
        TG_OP,
        CASE TG_OP WHEN 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE TG_OP WHEN 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        v_campos_mod
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_recalcular_finanzas_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_jornada_id INTEGER;
BEGIN
    v_jornada_id = COALESCE(NEW.jornada_id, OLD.jornada_id);
    PERFORM fn_recalcular_finanzas_jornada(v_jornada_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_registrar_intento_fallido(p_usuario_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE usuarios
       SET intentos_fallidos = intentos_fallidos + 1,
           bloqueado_hasta = CASE
               WHEN intentos_fallidos + 1 >= 5 THEN CURRENT_TIMESTAMP + INTERVAL '30 minutes'
               ELSE bloqueado_hasta
           END
     WHERE id = p_usuario_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION fn_login_exitoso(p_usuario_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE usuarios
       SET intentos_fallidos = 0,
           bloqueado_hasta = NULL,
           ultimo_login = CURRENT_TIMESTAMP,
           ultimo_acceso = CURRENT_TIMESTAMP
     WHERE id = p_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trg_upd_roles ON roles;
DROP TRIGGER IF EXISTS trg_upd_usuarios ON usuarios;
DROP TRIGGER IF EXISTS trg_upd_vehiculos ON vehiculos;
DROP TRIGGER IF EXISTS trg_upd_jornadas ON jornadas;

CREATE TRIGGER trg_upd_roles
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_upd_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_upd_vehiculos
BEFORE UPDATE ON vehiculos
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

CREATE TRIGGER trg_upd_jornadas
BEFORE UPDATE ON jornadas
FOR EACH ROW EXECUTE FUNCTION fn_actualizar_timestamp();

DROP TRIGGER IF EXISTS trg_cierre_jornada ON jornadas;
CREATE TRIGGER trg_cierre_jornada
BEFORE UPDATE ON jornadas
FOR EACH ROW EXECUTE FUNCTION fn_cerrar_jornada_automatico();

DROP TRIGGER IF EXISTS trg_validar_actividad_jornada ON actividades_gastos;
DROP TRIGGER IF EXISTS trg_validar_anticipo_jornada ON anticipos;
DROP TRIGGER IF EXISTS trg_validar_checklist_jornada ON checklist_diario;

CREATE TRIGGER trg_validar_actividad_jornada
BEFORE INSERT OR UPDATE ON actividades_gastos
FOR EACH ROW EXECUTE FUNCTION fn_validar_jornada_activa();

CREATE TRIGGER trg_validar_anticipo_jornada
BEFORE INSERT OR UPDATE ON anticipos
FOR EACH ROW EXECUTE FUNCTION fn_validar_jornada_activa();

CREATE TRIGGER trg_validar_checklist_jornada
BEFORE INSERT OR UPDATE ON checklist_diario
FOR EACH ROW EXECUTE FUNCTION fn_validar_jornada_activa();

DROP TRIGGER IF EXISTS trg_recalcular_gastos ON actividades_gastos;
DROP TRIGGER IF EXISTS trg_recalcular_anticipos ON anticipos;

CREATE TRIGGER trg_recalcular_gastos
AFTER INSERT OR UPDATE OR DELETE ON actividades_gastos
FOR EACH ROW EXECUTE FUNCTION fn_recalcular_finanzas_trigger();

CREATE TRIGGER trg_recalcular_anticipos
AFTER INSERT OR UPDATE OR DELETE ON anticipos
FOR EACH ROW EXECUTE FUNCTION fn_recalcular_finanzas_trigger();

DROP TRIGGER IF EXISTS trg_limpiar_tokens_expirados ON token_blacklist;
CREATE TRIGGER trg_limpiar_tokens_expirados
AFTER INSERT ON token_blacklist
FOR EACH STATEMENT EXECUTE FUNCTION fn_limpiar_tokens_expirados();

DROP TRIGGER IF EXISTS trg_limpiar_sesiones ON sesiones_activas;
CREATE TRIGGER trg_limpiar_sesiones
AFTER INSERT ON sesiones_activas
FOR EACH STATEMENT EXECUTE FUNCTION fn_limpiar_sesiones_expiradas();

DROP TRIGGER IF EXISTS trg_audit_jornadas ON jornadas;
DROP TRIGGER IF EXISTS trg_audit_actividades_gastos ON actividades_gastos;
DROP TRIGGER IF EXISTS trg_audit_mantenimiento ON mantenimiento_vida_util;
DROP TRIGGER IF EXISTS trg_audit_usuarios ON usuarios;

CREATE TRIGGER trg_audit_jornadas
AFTER INSERT OR UPDATE OR DELETE ON jornadas
FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial();

CREATE TRIGGER trg_audit_actividades_gastos
AFTER INSERT OR UPDATE OR DELETE ON actividades_gastos
FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial();

CREATE TRIGGER trg_audit_mantenimiento
AFTER INSERT OR UPDATE OR DELETE ON mantenimiento_vida_util
FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial();

CREATE TRIGGER trg_audit_usuarios
AFTER UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION fn_registrar_historial();

-- ============================================================================
-- 10. VISTAS
-- ============================================================================

CREATE OR REPLACE VIEW v_jornadas_activas AS
SELECT
    j.id,
    u.nombre AS conductor,
    v.unidad_nro AS vehiculo,
    v.tipo AS tipo_vehiculo,
    j.fecha_hora_inicio,
    CURRENT_TIMESTAMP - j.fecha_hora_inicio AS tiempo_activo,
    j.capital_recibido,
    j.viaticos_entregados,
    COALESCE((SELECT SUM(a.monto) FROM anticipos a WHERE a.jornada_id = j.id), 0) AS total_anticipos,
    j.total_gastos,
    (j.capital_recibido + j.viaticos_entregados + COALESCE((SELECT SUM(a.monto) FROM anticipos a WHERE a.jornada_id = j.id), 0)) - j.total_gastos AS saldo_disponible,
    j.gps_inicio
FROM jornadas j
JOIN usuarios u ON u.id = j.usuario_id
JOIN vehiculos v ON v.id = j.vehiculo_id
WHERE j.estado = 'activa';

CREATE OR REPLACE VIEW v_alertas_pendientes AS
SELECT
    a.id,
    v.unidad_nro,
    v.tipo,
    v.marca,
    v.modelo,
    a.tipo_alerta,
    a.urgencia,
    a.horas_actuales,
    a.horas_limite,
    a.horas_restantes,
    a.descripcion,
    a.creado_en
FROM alertas_mantenimiento a
JOIN vehiculos v ON v.id = a.vehiculo_id
WHERE a.resuelta = false;

CREATE OR REPLACE VIEW v_resumen_financiero AS
SELECT
    j.id AS jornada_id,
    u.nombre AS conductor,
    v.unidad_nro AS vehiculo,
    j.fecha_hora_inicio::DATE AS fecha,
    j.estado,
    j.capital_recibido,
    j.viaticos_entregados,
    COALESCE((SELECT SUM(a.monto) FROM anticipos a WHERE a.jornada_id = j.id), 0) AS total_anticipos,
    j.total_gastos,
    j.saldo_rendido,
    j.diferencia_caja,
    CASE
        WHEN j.diferencia_caja > 0 THEN 'sobrante'
        WHEN j.diferencia_caja < 0 THEN 'faltante'
        WHEN j.diferencia_caja = 0 THEN 'cuadrado'
        ELSE 'pendiente'
    END AS estado_caja,
    j.aprobado_por_id IS NOT NULL AS aprobado,
    j.km_recorridos
FROM jornadas j
JOIN usuarios u ON u.id = j.usuario_id
JOIN vehiculos v ON v.id = j.vehiculo_id;

CREATE OR REPLACE VIEW v_sesiones_activas AS
SELECT
    s.id,
    u.nombre AS usuario,
    r.nombre AS rol,
    s.ip_address,
    s.device_info,
    s.ultimo_acceso,
    s.expira_en,
    s.creado_en AS inicio_sesion
FROM sesiones_activas s
JOIN usuarios u ON u.id = s.usuario_id
JOIN roles r ON r.id = u.rol_id
WHERE s.activa = true
  AND s.expira_en > CURRENT_TIMESTAMP;

-- ============================================================================
-- 11. DATOS SEMILLA
-- ============================================================================

INSERT INTO roles (nombre, descripcion)
VALUES
    ('Admin', 'Control total del sistema'),
    ('Trabajador', 'Operacion diaria'),
    ('Supervisor', 'Supervision de operaciones')
ON CONFLICT (nombre) DO UPDATE
    SET descripcion = EXCLUDED.descripcion,
        actualizado_en = CURRENT_TIMESTAMP;

COMMIT;
