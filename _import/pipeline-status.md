# Estado del pipeline de imágenes

**BLOQUEADO: red aún sin acceso a drive.google.com**

- Fecha del intento: 2026-08-19 ~19:15 UTC
- Verificación ejecutada: `curl -sL "https://drive.google.com/uc?id=1IlYIOfwzhAjEYlDI7A_zhIn1DMR3S70k&export=download"`
- Resultado: `CONNECT tunnel failed, response 403` — el gateway del proxy de red
  rechaza el CONNECT a `drive.google.com:443` (denegación de política).
  Reintentado 3× con backoff; mismo resultado en todos los intentos.
- Estado del proxy (`__agentproxy/status`): `connect_rejected — gateway answered 403
  to CONNECT (policy denial or upstream failure)` para `drive.google.com:443`.

## Alternativa evaluada y descartada

Hay un conector MCP de Google Drive disponible en la sesión, pero su herramienta de
descarga devuelve el binario como base64 dentro de la respuesta del tool (pasa por el
contexto del modelo). Para ~684 archivos webp (~cientos de MB) el costo en tokens lo
hace inviable como canal de descarga masiva. No es un sustituto del acceso HTTP directo.

## Qué se necesita para desbloquear

Permitir en la política de red del entorno (Claude Code on the web → environment →
network policy) el dominio `drive.google.com` (y `*.googleusercontent.com`, que sirve
las redirecciones de descarga de archivos grandes). Después, relanzar el pipeline:
la spec completa está en `docs/imagenes-spec.md` y el manifest en
`_import/drive_manifest.json`.

## Progreso

- [x] Verificación de red — FALLÓ (403 CONNECT)
- [ ] DESCARGANDO (0/684)
- [ ] PROCESANDO
- [ ] THEME ACTUALIZADO
- [ ] VERIFICADO
- [ ] LISTO
