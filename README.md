# Calendario Pilates - Documentación Inicial

📌 Estructura del proyecto
Aplicación web desarrollada con React y Chakra UI, orientada a la gestión de turnos mensuales para un estudio de pilates. Por el momento se implementaron las siguientes funcionalidades y estructuras base:

✅ Funcionalidades implementadas
- Pantalla Home
Página principal accesible al iniciar la app. Incluye bienvenida y opciones de navegación inicial.

- SidebarMenu responsivo
Menú lateral adaptado para desktop y versión móvil, con Drawer y botón de cierre en mobile. Contiene accesos rápidos a Login y Registro.

- Ruteo con React Router
Navegación entre páginas usando react-router-dom. Se configuraron rutas base como /, /login, y /register.

- Tematización con Chakra UI
Se creó un tema personalizado (theme.js) con:

    - Colores primarios y secundarios

    - Tipografías personalizadas (Poppins para headings y Roboto para texto)

    - Estilo global para los botones (Button) con hover y transición

- Diseño mobile-first
Componentes adaptados para una experiencia óptima en celular, especialmente el menú lateral y botones.

# 1. Frontend - Registro y Login
- Página de Registro (RegisterPage)
Se creó un formulario de registro con los siguientes campos:

Nombre

Apellido

Email

Celular

Días Semanales (opciones: 1, 2 o 3 veces por semana)

Contraseña

Confirmar Contraseña

Validación básica para asegurarse de que los campos no estén vacíos.

El formulario es completamente responsivo para adaptarse a dispositivos móviles.

Se agregó un botón que redirige al Home desde la página de registro.

- Página de Login (LoginPage)
Se creó un formulario de inicio de sesión con los siguientes campos:

Email

Contraseña

Validación básica para verificar que los campos no estén vacíos.

El formulario es responsivo para que se vea correctamente en dispositivos móviles.

Se agregó un botón para volver al inicio desde la página de login.

# 2. Estructura Responsiva
Los formularios de registro y login se centraron vertical y horizontalmente utilizando Flex de Chakra UI, asegurando que se vean bien en todas las resoluciones de pantalla, especialmente en dispositivos móviles.