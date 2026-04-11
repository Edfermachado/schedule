/**
 * Módulo de Renderizado del Calendario
 * Maneja la visualización del horario en formato grid (desktop) y lista (móvil)
 */

import { loadActivities, getDurationHours, toMinutes } from './dataManager.js';

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const hours = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const CELL_HEIGHT = 64;

/**
 * Genera el HTML para una actividad individual
 */
function createActivityElement(activity, isMobile = false) {
  const element = document.createElement('div');
  
  if (isMobile) {
    element.className = 'glass p-4 rounded-2xl mb-2 flex items-center justify-between border border-white/10 cursor-pointer transition-all duration-200 hover:shadow-lg';
    element.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${activity.icon}</span>
        <div>
          <div class="font-bold text-sm">${activity.title}</div>
          <div class="text-[10px] opacity-60">${activity.start} - ${activity.end}</div>
        </div>
      </div>
      <i class="fas fa-chevron-right opacity-30 text-xs"></i>
    `;
  } else {
    const height = getDurationHours(activity.start, activity.end) * CELL_HEIGHT;
    element.className = `schedule-item bg-${activity.type}`;
    element.style.height = `${height - 8}px`;
    element.innerHTML = `
      <i class="text-lg mb-1">${activity.icon}</i>
      <span class="px-1 text-center">${activity.title}</span>
    `;
  }
  
  element.addEventListener('click', () => {
    const event = new CustomEvent('activityClick', { detail: activity });
    document.dispatchEvent(event);
  });
  
  return element;
}

/**
 * Renderiza la vista móvil (lista por días)
 */
export function renderMobileView(container, filter = 'all') {
  container.innerHTML = '';
  const activities = loadActivities();
  
  days.forEach((dayName, dayIdx) => {
    const dayActivities = activities.filter(
      a => a.day === dayIdx && (filter === 'all' || a.type === filter)
    );
    
    if (dayActivities.length > 0) {
      // Ordenar por hora de inicio
      dayActivities.sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
      
      const daySection = document.createElement('div');
      daySection.className = 'mb-6';
      daySection.innerHTML = `<h4 class="font-bold text-xs uppercase tracking-widest opacity-50 mb-3">${dayName}</h4>`;
      
      dayActivities.forEach(activity => {
        const card = createActivityElement(activity, true);
        daySection.appendChild(card);
      });
      
      container.appendChild(daySection);
    }
  });
  
  // Mostrar mensaje si no hay actividades
  if (container.innerHTML === '') {
    container.innerHTML = `
      <div class="text-center py-8 opacity-60">
        <i class="fas fa-calendar-times text-4xl mb-3"></i>
        <p class="text-sm">No hay actividades para mostrar</p>
      </div>
    `;
  }
}

/**
 * Renderiza la vista desktop (grid semanal)
 */
export function renderGridView(container, filter = 'all', compactMode = false) {
  container.innerHTML = '';
  const activities = loadActivities();
  
  // Determinar qué horas mostrar
  let hoursToRender = hours;
  
  if (compactMode) {
    const hoursWithActivities = new Set();
    activities.forEach(activity => {
      if (filter === 'all' || activity.type === filter) {
        const startHour = activity.start.substring(0, 2) + ':00';
        hoursWithActivities.add(startHour);
      }
    });
    hoursToRender = hours.filter(h => hoursWithActivities.has(h));
  }
  
  hoursToRender.forEach(hour => {
    // Celda de hora
    const hourLabel = document.createElement('div');
    hourLabel.className = 'header-cell flex items-center justify-center border-b border-white/5';
    hourLabel.style.height = `${CELL_HEIGHT}px`;
    hourLabel.textContent = hour;
    container.appendChild(hourLabel);
    
    // Celdas de cada día
    for (let day = 0; day < 7; day++) {
      const cell = document.createElement('div');
      cell.className = 'border-b border-r border-white/5 relative bg-white/5';
      cell.style.height = `${CELL_HEIGHT}px`;
      
      // Buscar actividad que comienza en esta hora
      const activity = activities.find(
        a => a.day === day && 
             a.start.substring(0, 2) === hour.substring(0, 2) &&
             (filter === 'all' || a.type === filter)
      );
      
      if (activity) {
        const bar = createActivityElement(activity, false);
        cell.appendChild(bar);
      }
      
      container.appendChild(cell);
    }
  });
}

/**
 * Obtiene las etiquetas de los días (para usar en otros módulos)
 */
export function getDayLabels() {
  return [...days];
}

/**
 * Obtiene las horas disponibles (para usar en otros módulos)
 */
export function getHourLabels() {
  return [...hours];
}

/**
 * Obtiene la altura de celda configurada
 */
export function getCellHeight() {
  return CELL_HEIGHT;
}
