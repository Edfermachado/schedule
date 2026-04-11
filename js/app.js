/**
 * Módulo Principal de la Aplicación
 * Coordina todos los módulos y maneja la lógica central
 */

import { loadActivities } from './modules/dataManager.js';
import { renderMobileView, renderGridView, getDayLabels } from './modules/calendarRenderer.js';
import { initChart, updateChart } from './modules/chartManager.js';
import { showActivityDetail, showDefaultMessage } from './modules/detailPanel.js';
import { openModal, closeModal, confirmDelete, initModalListeners } from './modules/modalManager.js';
import { initTheme, initThemeButton } from './modules/themeManager.js';

// Estado de la aplicación
let currentFilter = 'all';
let compactMode = false;

/**
 * Renderiza toda la interfaz según el estado actual
 */
export function renderAll() {
  const gridContainer = document.getElementById('grid-content');
  const listContainer = document.getElementById('list-wrapper');
  
  if (window.innerWidth < 768) {
    renderMobileView(listContainer, currentFilter);
  } else {
    renderGridView(gridContainer, currentFilter, compactMode);
  }
}

/**
 * Aplica un filtro de categoría
 */
export function applyFilter(filterType) {
  currentFilter = filterType;
  
  // Actualizar botones de filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterType);
  });
  
  renderAll();
}

/**
 * Alterna el modo compacto
 */
export function toggleCompactMode() {
  compactMode = !compactMode;
  
  const btn = document.getElementById('minimizeBtn');
  if (btn) {
    btn.innerHTML = compactMode 
      ? '<i class="fas fa-expand-alt mr-1"></i> Expandir' 
      : '<i class="fas fa-compress-alt mr-1"></i> Compactar';
  }
  
  renderAll();
}

/**
 * Inicializa los listeners globales
 */
function initGlobalListeners() {
  // Listener para clicks en actividades
  document.addEventListener('activityClick', (e) => {
    showActivityDetail(e.detail);
  });
  
  // Listener para cambios de tamaño de ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(renderAll, 200);
  });
  
  // Funciones expuestas globalmente para los handlers inline
  window.editActivity = (id) => {
    const activity = loadActivities().find(a => a.id === id);
    if (activity) {
      openModal(activity);
    }
  };
  
  window.deleteActivity = (id) => {
    confirmDelete(id);
  };
  
  window.openNewActivityModal = () => {
    openModal(null);
  };
  
  window.filterSchedule = applyFilter;
  window.toggleEmptyRows = toggleCompactMode;
}

/**
 * Inicializa los filtros de categoría
 */
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
    });
  });
}

/**
 * Inicializa el botón de compactar
 */
function initCompactButton() {
  const btn = document.getElementById('minimizeBtn');
  if (btn) {
    btn.addEventListener('click', toggleCompactMode);
  }
}

/**
 * Punto de entrada principal de la aplicación
 */
export function initApp() {
  // Inicializar tema
  initTheme();
  initThemeButton();
  
  // Cargar datos iniciales
  loadActivities();
  
  // Renderizar vista inicial
  renderAll();
  
  // Inicializar gráfico
  const chartCanvas = document.getElementById('balanceChart');
  if (chartCanvas) {
    initChart(chartCanvas);
  }
  
  // Inicializar panel de detalles
  showDefaultMessage();
  
  // Inicializar modal y sus listeners
  initModalListeners();
  
  // Inicializar listeners globales
  initGlobalListeners();
  
  // Inicializar filtros
  initFilters();
  
  // Inicializar botón de compactar
  initCompactButton();
  
  console.log('✅ Planificador Semanal inicializado correctamente');
}

// Exportar funciones necesarias para otros módulos
export { openModal, closeModal } from './modules/modalManager.js';
