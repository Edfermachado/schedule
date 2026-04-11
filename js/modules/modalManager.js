/**
 * Módulo de Gestión del Modal de Actividades
 * Maneja el formulario para agregar y editar actividades
 */

import { 
  addActivity, 
  updateActivity, 
  deleteActivity, 
  hasTimeConflict,
  getActivityById 
} from './dataManager.js';
import { updateChart } from './chartManager.js';
import { showDefaultMessage } from './detailPanel.js';

let currentEditingId = null;
let renderAllCallback = null;

/**
 * Establece la función de renderizado (para evitar importación circular)
 */
export function setRenderAllCallback(callback) {
  renderAllCallback = callback;
}

/**
 * Abre el modal para agregar/editar actividad
 */
export function openModal(activity = null) {
  const modal = document.getElementById('activityModal');
  const form = document.getElementById('activityForm');
  const title = document.getElementById('modalTitle');
  
  if (!modal || !form) {
    console.error('Modal o formulario no encontrado');
    return;
  }
  
  // Resetear formulario
  form.reset();
  currentEditingId = null;
  
  if (activity) {
    // Modo edición
    title.textContent = 'Editar Actividad';
    currentEditingId = activity.id;
    
    document.getElementById('actTitle').value = activity.title;
    document.getElementById('actDay').value = activity.day;
    document.getElementById('actStart').value = activity.start;
    document.getElementById('actEnd').value = activity.end;
    document.getElementById('actType').value = activity.type;
    document.getElementById('actIcon').value = activity.icon;
    document.getElementById('actDesc').value = activity.desc || '';
  } else {
    // Modo creación
    title.textContent = 'Nueva Actividad';
    // Valores por defecto
    document.getElementById('actDay').value = new Date().getDay();
    document.getElementById('actStart').value = '09:00';
    document.getElementById('actEnd').value = '10:00';
    document.getElementById('actType').value = 'academic';
    document.getElementById('actIcon').value = '📚';
  }
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

/**
 * Cierra el modal
 */
export function closeModal() {
  const modal = document.getElementById('activityModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  currentEditingId = null;
}

/**
 * Maneja el envío del formulario
 */
export function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = {
    title: document.getElementById('actTitle').value.trim(),
    day: parseInt(document.getElementById('actDay').value),
    start: document.getElementById('actStart').value,
    end: document.getElementById('actEnd').value,
    type: document.getElementById('actType').value,
    icon: document.getElementById('actIcon').value,
    desc: document.getElementById('actDesc').value.trim()
  };
  
  // Validaciones básicas
  if (!formData.title) {
    showError('El título es obligatorio');
    return;
  }
  
  if (formData.start >= formData.end) {
    showError('La hora de fin debe ser posterior a la de inicio');
    return;
  }
  
  // Validar superposición de horarios
  if (hasTimeConflict(formData.day, formData.start, formData.end, currentEditingId)) {
    if (!confirm('⚠️ Hay una superposición de horarios. ¿Deseas continuar?')) {
      return;
    }
  }
  
  // Guardar actividad
  if (currentEditingId) {
    updateActivity(currentEditingId, formData);
  } else {
    addActivity(formData);
  }
  
  // Cerrar modal y actualizar UI
  closeModal();
  if (renderAllCallback) renderAllCallback();
  updateChart();
  showDefaultMessage();
  
  // Mostrar notificación de éxito
  showNotification(currentEditingId ? 'Actividad actualizada' : 'Actividad agregada');
}

/**
 * Elimina una actividad con confirmación
 */
export function confirmDelete(activityId) {
  if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
    deleteActivity(activityId);
    if (renderAllCallback) renderAllCallback();
    updateChart();
    showDefaultMessage();
    showNotification('Actividad eliminada', 'error');
  }
}

/**
 * Muestra un mensaje de error en el formulario
 */
function showError(message) {
  const errorDiv = document.getElementById('formError');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 3000);
  }
}

/**
 * Muestra una notificación toast
 */
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg text-white font-bold z-50 animate-slide-up ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Inicializa los listeners del modal
 */
export function initModalListeners() {
  const form = document.getElementById('activityForm');
  const closeBtn = document.getElementById('closeModal');
  const modalBg = document.getElementById('modalBg');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (modalBg) {
    modalBg.addEventListener('click', closeModal);
  }
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}
