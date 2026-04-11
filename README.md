# Planificador Semanal - Glass Edition v2.0

Aplicación web de planificación semanal con diseño Glassmorphism, completamente modularizada y con funcionalidades CRUD completas.

## 🚀 Características Principales

### Funcionalidades Implementadas
- ✅ **CRUD Completo**: Agregar, editar y eliminar actividades
- ✅ **Persistencia de Datos**: localStorage para guardar actividades
- ✅ **Gráfico Dinámico**: Distribución de tiempo por categoría (Chart.js)
- ✅ **Modo Oscuro/Claro**: Con persistencia de preferencia
- ✅ **Filtros por Categoría**: Académico, Arte, Estudio, Vida
- ✅ **Vista Responsiva**: Grid para desktop, lista para móvil
- ✅ **Validación de Horarios**: Detección de superposiciones
- ✅ **Modal de Actividades**: Formulario completo para gestión
- ✅ **Notificaciones Toast**: Feedback visual de acciones
- ✅ **Animaciones CSS**: Transiciones suaves y modernas

### Mejoras de Código
- 📦 **Arquitectura Modular**: 6 módulos ES6 independientes
- 🔒 **Gestión de Estado Centralizada**: dataManager como fuente única de verdad
- 🎯 **Separación de Responsabilidades**: Cada módulo tiene una función clara
- ♻️ **Código Reutilizable**: Funciones exportables para mantenimiento fácil
- 🐛 **Manejo de Errores**: Try-catch en operaciones críticas

## 📁 Estructura del Proyecto

```
/workspace/
├── index.html              # HTML principal con modal integrado
├── styles.css              # Estilos CSS con animaciones
├── js/
│   ├── app.js              # Módulo principal (punto de entrada)
│   └── modules/
│       ├── dataManager.js      # Gestión de datos y localStorage
│       ├── calendarRenderer.js # Renderizado grid/lista
│       ├── chartManager.js     # Gráfico de distribución
│       ├── detailPanel.js      # Panel de detalles
│       ├── modalManager.js     # Modal CRUD
│       └── themeManager.js     # Modo oscuro/claro
└── README.md               # Este archivo
```

## 🛠️ Módulos

### dataManager.js
- `loadActivities()`: Carga desde localStorage o datos por defecto
- `saveActivities()`: Guarda en localStorage
- `addActivity()`, `updateActivity()`, `deleteActivity()`: CRUD
- `hasTimeConflict()`: Valida superposición de horarios
- `getCategoryDistribution()`: Estadísticas para gráfico

### calendarRenderer.js
- `renderMobileView()`: Vista lista para móviles
- `renderGridView()`: Vista grid para desktop
- `getDayLabels()`, `getHourLabels()`: Utilidades

### chartManager.js
- `initChart()`: Inicializa Chart.js
- `updateChart()`: Actualiza con datos dinámicos
- `destroyChart()`: Limpia instancia

### detailPanel.js
- `showActivityDetail()`: Muestra detalles de actividad
- `showDefaultMessage()`: Mensaje por defecto

### modalManager.js
- `openModal()`, `closeModal()`: Gestión de modal
- `handleFormSubmit()`: Procesa formulario
- `confirmDelete()`: Eliminación con confirmación
- `initModalListeners()`: Configura eventos

### themeManager.js
- `initTheme()`: Carga preferencia guardada
- `toggleTheme()`: Alterna modo oscuro/claro

### app.js
- `initApp()`: Punto de entrada principal
- `renderAll()`: Renderiza vista completa
- `applyFilter()`: Aplica filtros de categoría
- `toggleCompactMode()`: Activa/desactiva compactado

## 🎨 Uso

1. **Abrir la aplicación**: Abre `index.html` en un navegador moderno
2. **Agregar actividad**: Click en botón "+" verde
3. **Ver detalles**: Click en cualquier actividad
4. **Editar/Eliminar**: Botones en panel de detalles
5. **Filtrar**: Usa los botones superiores
6. **Cambiar tema**: Click en ícono de luna/sol

## 🔧 Tecnologías

- **HTML5** + **CSS3** (Glassmorphism)
- **JavaScript ES6 Modules**
- **Tailwind CSS** (vía CDN)
- **Chart.js** (vía CDN)
- **Font Awesome** (íconos)
- **localStorage** (persistencia)

## 📝 Notas

- Requiere servidor HTTP local para módulos ES6 (ej: `python -m http.server`)
- Compatible con navegadores modernos (Chrome, Firefox, Edge, Safari)
- Los datos se guardan automáticamente en el navegador

## 🎯 Próximas Mejoras Sugeridas

- Exportar/importar datos (JSON)
- Notificaciones push
- Sincronización con calendario externo
- Temas personalizables
- Modo impresión
