/**
 * Módulo de Gestión de Datos
 * Maneja el almacenamiento, carga y persistencia de actividades
 */

export const STORAGE_KEY = 'weekly_planner_activities';

// Datos iniciales por defecto (solo si no hay datos guardados)
const defaultActivities = [
  { id: '1', day: 0, start: '13:00', end: '17:00', title: 'Teatro', type: 'art', icon: '🎭', desc: 'Clase de actuación' },
  { id: '2', day: 1, start: '17:00', end: '19:00', title: 'Lenguaje Prog', type: 'academic', icon: '💻', desc: 'Laboratorio C++' },
  { id: '3', day: 2, start: '07:30', end: '10:30', title: 'Probabilidad', type: 'academic', icon: '🔢', desc: 'Aula 302' },
  { id: '4', day: 2, start: '15:00', end: '16:30', title: 'Inglés', type: 'academic', icon: '🇬🇧', desc: 'Zoom ID: 231...' },
  { id: '5', day: 3, start: '10:30', end: '12:00', title: 'Metodología', type: 'academic', icon: '📝', desc: 'Teoría' },
  { id: '6', day: 4, start: '07:30', end: '10:30', title: 'Probabilidad', type: 'academic', icon: '🔢', desc: 'Aula 302' },
  { id: '7', day: 4, start: '15:00', end: '16:30', title: 'Inglés', type: 'academic', icon: '🇬🇧', desc: 'Conversación' },
  { id: '8', day: 4, start: '18:00', end: '20:00', title: 'Ing Software', type: 'academic', icon: '💻', desc: 'Sprint 2' },
  { id: '9', day: 6, start: '08:30', end: '12:00', title: 'Redes I', type: 'academic', icon: '🌐', desc: 'Práctica de ruteo' }
];

/**
 * Carga las actividades desde localStorage o usa los datos por defecto
 */
export function loadActivities() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
  return [...defaultActivities];
}

/**
 * Guarda las actividades en localStorage
 */
export function saveActivities(activities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    return true;
  } catch (error) {
    console.error('Error al guardar actividades:', error);
    return false;
  }
}

/**
 * Agrega una nueva actividad
 */
export function addActivity(activity) {
  const activities = loadActivities();
  const newActivity = {
    ...activity,
    id: Date.now().toString()
  };
  activities.push(newActivity);
  saveActivities(activities);
  return newActivity;
}

/**
 * Actualiza una actividad existente
 */
export function updateActivity(id, updates) {
  const activities = loadActivities();
  const index = activities.findIndex(a => a.id === id);
  
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updates };
    saveActivities(activities);
    return activities[index];
  }
  return null;
}

/**
 * Elimina una actividad
 */
export function deleteActivity(id) {
  const activities = loadActivities();
  const filtered = activities.filter(a => a.id !== id);
  saveActivities(filtered);
  return filtered;
}

/**
 * Obtiene una actividad por ID
 */
export function getActivityById(id) {
  const activities = loadActivities();
  return activities.find(a => a.id === id) || null;
}

/**
 * Valida que no haya superposición de horarios
 */
export function hasTimeConflict(day, start, end, excludeId = null) {
  const activities = loadActivities();
  const newStart = toMinutes(start);
  const newEnd = toMinutes(end);
  
  return activities.some(activity => {
    if (excludeId && activity.id === excludeId) return false;
    if (activity.day !== day) return false;
    
    const actStart = toMinutes(activity.start);
    const actEnd = toMinutes(activity.end);
    
    return (newStart < actEnd && newEnd > actStart);
  });
}

/**
 * Convierte hora HH:MM a minutos
 */
export function toMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calcula la duración en horas entre dos tiempos
 */
export function getDurationHours(start, end) {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

/**
 * Obtiene estadísticas de distribución por categoría
 */
export function getCategoryDistribution() {
  const activities = loadActivities();
  const distribution = {
    academic: 0,
    art: 0,
    study: 0,
    life: 0
  };
  
  activities.forEach(activity => {
    const hours = getDurationHours(activity.start, activity.end);
    if (distribution[activity.type] !== undefined) {
      distribution[activity.type] += hours;
    }
  });
  
  return distribution;
}
