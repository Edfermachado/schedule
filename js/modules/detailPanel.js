/**
 * Módulo de Gestión del Panel de Detalles
 * Muestra información detallada de una actividad seleccionada
 */

const typeLabels = {
  academic: 'Académico',
  art: 'Arte',
  study: 'Estudio',
  life: 'Vida'
};

const typeIcons = {
  academic: '📚',
  art: '🎨',
  study: '📖',
  life: '🏠'
};

/**
 * Muestra los detalles de una actividad en el panel lateral
 */
export function showActivityDetail(activity) {
  const container = document.getElementById('detail-content');
  
  if (!container || !activity) {
    console.warn('Contenedor o actividad no disponible');
    return;
  }
  
  const categoryColor = getCategoryColor(activity.type);
  const typeName = typeLabels[activity.type] || activity.type;
  
  container.innerHTML = `
    <div class="flex flex-col items-center w-full animate-fade-in">
      <div class="${categoryColor} px-4 py-2 rounded-xl mb-4 text-white font-bold inline-block shadow-md flex items-center gap-2">
        <span class="text-lg">${activity.icon}</span>
        <span class="text-xs uppercase tracking-wider">${typeName}</span>
      </div>
      
      <h2 class="text-xl font-extrabold mb-2 text-center">${activity.title}</h2>
      
      <div class="flex items-center gap-2 text-blue-500 font-bold mb-3 bg-blue-500/10 px-3 py-1 rounded-lg">
        <i class="fas fa-clock"></i>
        <span>${activity.start} — ${activity.end}</span>
      </div>
      
      <p class="text-sm opacity-70 mb-4 text-center max-w-[250px]">${activity.desc || 'Sin descripción'}</p>
      
      <div class="w-full border-t border-white/10 pt-4 mt-2">
        <div class="flex justify-between text-xs opacity-60 mb-2">
          <span><i class="fas fa-calendar mr-1"></i> Día:</span>
          <span class="font-bold">${getDayName(activity.day)}</span>
        </div>
        <div class="flex justify-between text-xs opacity-60">
          <span><i class="fas fa-hourglass-half mr-1"></i> Duración:</span>
          <span class="font-bold">${calculateDuration(activity.start, activity.end)}</span>
        </div>
      </div>
      
      <div class="flex gap-2 mt-4 w-full">
        <button 
          onclick="window.editActivity('${activity.id}')"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <i class="fas fa-edit"></i> Editar
        </button>
        <button 
          onclick="window.deleteActivity('${activity.id}')"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    </div>
  `;
}

/**
 * Muestra un mensaje por defecto cuando no hay actividad seleccionada
 */
export function showDefaultMessage() {
  const container = document.getElementById('detail-content');
  
  if (!container) return;
  
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center italic opacity-60 text-sm px-4 py-8">
      <i class="fas fa-hand-pointer text-3xl mb-3 opacity-40"></i>
      <p>Toca una actividad para ver información detallada</p>
      <p class="text-xs mt-2 opacity-50">O usa el botón + para agregar una nueva</p>
    </div>
  `;
}

/**
 * Obtiene la clase CSS según el tipo de actividad
 */
function getCategoryColor(type) {
  const colors = {
    academic: 'bg-gradient-to-r from-blue-500 to-blue-600',
    art: 'bg-gradient-to-r from-pink-500 to-pink-600',
    study: 'bg-gradient-to-r from-green-500 to-green-600',
    life: 'bg-gradient-to-r from-amber-500 to-amber-600'
  };
  return colors[type] || 'bg-gradient-to-r from-gray-500 to-gray-600';
}

/**
 * Obtiene el nombre del día
 */
function getDayName(dayIndex) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayIndex] || 'Desconocido';
}

/**
 * Calcula la duración entre dos horas
 */
function calculateDuration(start, end) {
  const toMinutes = time => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };
  
  const diffMinutes = toMinutes(end) - toMinutes(start);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hrs`;
  return `${hours} hrs ${minutes} min`;
}
