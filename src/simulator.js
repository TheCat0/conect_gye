const scenarios = {
  rain: { name: 'Lluvias intensas', route: 'Av. Quito → Hospital del Niño', message: 'Acumulación de agua en Av. Quito. Evita el tramo afectado y solicita orientación para llegar al Hospital del Niño.', need: 'Acceso hospitalario', action: 'Equipo de salud confirma ingreso por emergencias y orientación de acceso.', recipients: 248 },
  transport: { name: 'Alta demanda de transporte', route: 'Terminal Río Daule → Centro', message: 'Alta demanda en el corredor. Consulta la actualización del servicio antes de desplazarte.', need: 'Refuerzo de transporte', action: 'Operador confirma un refuerzo simulado y organiza el punto de embarque.', recipients: 186 },
  closure: { name: 'Cierre vial verificado', route: 'Av. Quito → Hospital del Niño', message: 'Cierre vial simulado en el corredor hospitalario. Solicita orientación antes de iniciar tu recorrido.', need: 'Orientación de ruta', action: 'Tránsito confirma orientación por un acceso alternativo habilitado en el escenario.', recipients: 94 }
};
const labels = ['Evento detectado', 'Aviso validado', 'Respuesta ciudadana', 'Acción confirmada', 'Seguimiento comunicado'];
const descriptions = ['Se registra el evento en el corredor seleccionado.', 'Un operador valida el mensaje y activa el aviso simulado.', 'La ciudadanía indica su necesidad de desplazamiento.', 'La institución registra una respuesta verificable.', 'Se prepara una actualización para los ciudadanos afectados.'];
let sim;
try { sim = JSON.parse(localStorage.getItem('conecta-simulation')); } catch {}
if (!sim || !scenarios[sim.scenario] || !Number.isInteger(sim.step) || sim.step < 0 || sim.step > 5) sim = { scenario: 'rain', step: 0, log: [] };
const persist = () => localStorage.setItem('conecta-simulation', JSON.stringify(sim));
const safe = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderSimulator() {
 const s = scenarios[sim.scenario];
 return `<section class="card simulator"><div class="section-head"><div><h2>Simulador de coordinación</h2><p>Explora cómo un aviso se convierte en una respuesta institucional.</p></div><span class="badge warning">DATOS SIMULADOS</span></div><div class="sim-layout"><div class="sim-controls"><label for="scenario">Escenario del piloto</label><select id="scenario" ${sim.step ? 'disabled' : ''}>${Object.entries(scenarios).map(([key,value]) => `<option value="${key}" ${key === sim.scenario ? 'selected' : ''}>${value.name}</option>`).join('')}</select><p class="sim-route">${s.route}</p><div class="sim-message"><small>VISTA PREVIA DEL AVISO</small><p>${s.message}</p><span>Audiencia simulada: ${s.recipients} personas</span></div><button class="primary" id="sim-next" ${sim.step === 5 ? 'disabled' : ''}>${sim.step === 5 ? 'Simulación completada' : sim.step === 0 ? 'Iniciar simulación' : labels[sim.step]}</button><button class="secondary" id="sim-reset">Nuevo escenario</button><p class="sim-note">Avanza paso a paso. Las alertas y solicitudes se reflejan en el tablero. No se envían mensajes reales.</p></div><div class="sim-timeline">${labels.map((label,i) => `<article class="sim-step ${i < sim.step ? 'done' : ''}"><span class="step-number">${i < sim.step ? '✓' : i + 1}</span><div><h3>${label}</h3><p>${descriptions[i]}</p>${i < sim.step ? `<small>${safe(sim.log[i] || '')}</small>` : ''}</div></article>`).join('')}</div></div><div class="sim-results"><div><strong>${sim.step >= 2 ? s.recipients : 0}</strong><span>Avisos simulados</span></div><div><strong>${sim.step >= 3 ? 1 : 0}</strong><span>Necesidad registrada</span></div><div><strong>${sim.step >= 4 ? 1 : 0}</strong><span>Acción confirmada</span></div><div><strong>${sim.step}/5</strong><span>Etapas completadas</span></div></div>${sim.step === 5 ? '<div class="sim-complete">Ciclo completado: información a tiempo, necesidad visible y respuesta coordinada. Consulta la solicitud atendida en el tablero.</div>' : ''}</section>`;
}
export function bindSimulator(state, save, render) {
 document.querySelector('#scenario')?.addEventListener('change', e => { sim.scenario = e.target.value; persist(); render(); });
 document.querySelector('#sim-reset')?.addEventListener('click', () => { sim = { scenario: sim.scenario, step: 0, log: [] }; persist(); render(); });
 document.querySelector('#sim-next')?.addEventListener('click', () => {
  if (sim.step >= 5) return;
  const s = scenarios[sim.scenario];
  if (sim.step === 0) { sim.id = crypto.randomUUID(); sim.log.push(`${s.name} · ${s.route}`); }
  if (sim.step === 1) { state.alerts++; state.activity.push({ event: s.name, message: s.message, route: s.route, simulationId: sim.id }); sim.log.push(`Aviso validado para ${s.recipients} destinatarios simulados.`); }
  if (sim.step === 2) { state.requests.unshift({ name: 'Ciudadano del simulador', route: s.route, type: s.need, time: 'Ahora', status: 'Pendiente', simulationId: sim.id }); sim.log.push(s.need); }
  if (sim.step === 3) { const request = state.requests.find(r => r.simulationId === sim.id); if (request) { request.status = 'Atendida'; request.response = s.action; } sim.log.push(s.action); }
  if (sim.step === 4) { state.activity.push({ event: 'Seguimiento: acción confirmada', message: s.action, route: s.route, simulationId: sim.id }); state.alerts++; sim.log.push('Actualización simulada registrada en el centro de alertas.'); }
  sim.step++; save(); persist(); render();
 });
}
