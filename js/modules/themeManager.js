/**
 * Módulo de Gestión del Tema (Modo Oscuro/Claro)
 */

export const THEME_KEY = 'weekly_planner_theme';

/**
 * Inicializa el tema basado en la preferencia guardada o del sistema
 */
export function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Alterna entre modo oscuro y claro
 */
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

/**
 * Actualiza el ícono del botón de tema
 */
function updateThemeIcon(isDark) {
  const icon = document.querySelector('#darkToggle i');
  if (icon) {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/**
 * Configura el listener para el botón de tema
 */
export function initThemeButton() {
  const toggleBtn = document.getElementById('darkToggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Actualizar ícono al cargar
  updateThemeIcon(document.documentElement.classList.contains('dark'));
}
