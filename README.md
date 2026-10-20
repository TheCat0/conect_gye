# CONECTA GYE

Prototipo del equipo **Legendaries**: alertas que conectan decisiones con respuestas.

## Desarrollo

Requiere Node.js 20.19+ o 22.12+.

```sh
npm ci --cache /tmp/conecta-npm-cache
npm run dev
```

`npm run build` genera `dist/`; `npm run preview` permite comprobar la compilación.

## Flujo del piloto

1. En **Vista ciudadana**, registra voluntariamente un recorrido.
2. Crea una alerta y confirma su validación para el ejercicio.
3. Registra una necesidad de transporte u orientación hospitalaria.
4. En **Solicitudes**, abre la solicitud, describe la acción y confírmala.
5. Comprueba el estado atendido y los indicadores del resumen.

Los registros se conservan en `localStorage` en el mismo navegador. La aplicación utiliza datos simulados y un mapa esquemático; no envía mensajes reales, no tiene autenticación institucional ni ofrece asistencia de emergencia. Las integraciones con operadores, meteorología y mensajería requieren un backend y acuerdos del piloto. No introduzcas datos personales reales. La clasificación mediante IA es una propuesta futura, no una función conectada.

## Simulador

Abre **Simulador** y elige lluvias, alta demanda de transporte o cierre vial. Avanza por las cinco etapas: evento, validación, necesidad, acción y seguimiento. Las solicitudes y alertas aparecen en las otras secciones y se conservan al recargar. **Nuevo escenario** reinicia el recorrido del simulador conservando el historial del tablero.

## Publicación en GitHub Pages

La carpeta `docs/` contiene la versión web compilada con rutas relativas. Para actualizarla:

```sh
npm run build -- --base=./ --outDir docs
```

En el repositorio, abre **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/docs** y guarda. GitHub mostrará el enlace público cuando termine el despliegue. La presencia de `docs/` por sí sola no activa Pages.
