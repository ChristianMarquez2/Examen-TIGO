📱 Tigo Conecta

Examen del Primer Bimestre – Desarrollo de Aplicaciones Móviles

Aplicación móvil desarrollada tras la adquisición de MOVISTAR ECUADOR por TIGO, con el objetivo de ofrecer una plataforma moderna para promocionar, gestionar y contratar planes móviles a través de canales digitales.
Como tecnólogo en Software de la EPN, has sido contratado para construir Tigo Conecta, una app completa con autenticación, roles, chat en tiempo real, catálogo dinámico y funcionalidades de asesoría.

🚀 Objetivos del Proyecto

Implementar autenticación y autorización con diferentes roles de usuario.

Gestionar bases de datos utilizando Supabase o Firebase.

Implementar almacenamiento de archivos con Supabase Storage.

Crear un sistema de chat en tiempo real usando Realtime.

Desarrollar una UI/UX clara, intuitiva y responsiva.

👥 Roles de Usuario y Funcionalidades
🟦 1. Asesor Comercial

CRUD completo de planes móviles.

Subida y gestión de imágenes promocionales.

Chat en tiempo real con usuarios.

Visualización y gestión de solicitudes de contratación.

🟧 2. Usuario Invitado (No autenticado)

Visualización pública del catálogo de planes.

Acceso solo lectura.

Sin chat, sin contratación.

🟩 3. Usuario Registrado

Consulta del catálogo.

Contratación de planes.

Chat en tiempo real con asesores.

Historial de contrataciones.

🗄️ Requerimientos Técnicos
🔐 A. Autenticación y Autorización
Registro e Inicio de Sesión

Email + contraseña.

Validación completa de formularios.

Asignación automática del rol usuario_registrado.

Gestión de Roles

Tabla perfiles:

asesor_comercial

usuario_registrado

Políticas de Acceso

Asesor: CRUD total sobre planes_moviles.

Usuario registrado: solo lectura de planes activos.

Control total para contrataciones y mensajes_chat.

🗂️ B. Almacenamiento – Supabase Storage

Bucket: planes-imagenes

Formatos permitidos: JPG, PNG

Tamaño máximo: 5MB

Políticas:

Asesores → subir / editar / eliminar.

Todos → lectura pública.

Implementación requerida:

Función para subir imagen al crear/editar plan.

Mostrar imagen en tarjetas del catálogo.

Eliminar imagen antigua al actualizar.

💬 C. Tiempo Real – Supabase Realtime
1. Chat Bidireccional

Suscripción a la tabla mensajes_chat.

Recarga automática de mensajes.

Notificación de nuevos mensajes.

Indicador "escribiendo..." como bonus.

2. Catálogo en Tiempo Real

Actualización instantánea cuando un asesor crea o edita un plan.

Cambios reflejados inmediatamente en usuarios.

🖥️ Pantallas del Proyecto
Invitado

Splash / Onboarding

Catálogo de Planes

Detalle de Plan

Login / Registro

Usuario Registrado

Home / Catálogo

Detalle del Plan + botón Contratar

Mis Contrataciones

Chat con Asesor

Perfil de Usuario

Asesor Comercial

Dashboard de Planes

Crear / Editar Plan (con imagen)

Solicitudes de Contratación

Chats con Clientes

Perfil de Asesor

📦 Planes Móviles Tigo Ecuador
🟦 Plan Smart 5GB — $15.99/mes

Segmento: Básico
Público objetivo: estudiantes, adultos mayores
Incluye:

5GB LTE

100 min nacionales

SMS ilimitados

WhatsApp incluido

Sin roaming

🟧 Plan Premium 15GB — $29.99/mes

Segmento: Medio
Público objetivo: profesionales, usuarios de redes
Incluye:

15GB LTE

Redes sociales GRATIS (FB, IG, TikTok)

WhatsApp ilimitado

300 min nacionales

500MB roaming (Sudamérica)

🟥 Plan Ilimitado Total — $45.99/mes

Segmento: Alto / Premium
Público objetivo: gamers, streamers, empresarios
Incluye:

Datos ilimitados 4G/5G

Minutos + SMS ilimitados

Todas las redes sociales ilimitadas

100 min internacionales

5GB roaming América

🧭 Flujos Principales
➤ Flujo Usuario Registrado

Inicia sesión

Navega catálogo

Contrata plan

Chatea con asesor

Ve sus planes e historial

➤ Flujo Asesor Comercial

Accede al panel

Crea/edita planes

Revisa solicitudes

Aprueba / Rechaza

Chatea con clientes

🛠️ Tecnologías Utilizadas

Ionic / Angular (o Flutter/React Native según implementación)

Supabase: Auth, Database, Storage, Realtime

Capacitor para generar APK

TypeScript

RxJS

Modern UI con Ionic Components

📦 Instalación y Ejecución
# Clonar repositorio
git clone https://github.com/tu-usuario/tigo-conecta
cd tigo-conecta

# Instalar dependencias
npm install

# Configurar entorno
# Añadir supabaseUrl y supabaseKey en environment.ts

# Ejecutar en modo dev
ionic serve

# Compilar Android
ionic build
npx cap sync
npx cap open android

📄 Licencia

Proyecto académico – Escuela Politécnica Nacional.
