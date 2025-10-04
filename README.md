# 🤖 Amelia - Asistente Virtual Universitario  
  
Asistente virtual impulsado por IA diseñado específicamente para la Universidad de la Costa. Amelia ayuda a estudiantes, profesores y futuros estudiantes a acceder a información sobre programas académicos, costos, admisiones, instalaciones del campus y otros servicios institucionales.  
  
## 🚀 Características Principales  
  
- **Chat en Tiempo Real**: Interfaz de conversación moderna con streaming de respuestas  
- **IA Contextual**: Integración con Google Gemini AI con conocimiento específico de la universidad  
- **Renderizado Markdown**: Soporte completo para formato de texto enriquecido con resaltado de sintaxis  
- **Persistencia de Conversaciones**: Historial de chat guardado en Supabase  
- **Autenticación OAuth**: Inicio de sesión con Google  
- **Diseño Responsivo**: Optimizado para dispositivos móviles y escritorio  
  
## 🛠️ Stack Tecnológico  
  
| Categoría | Tecnología | Propósito |  
|-----------|-----------|-----------|  
| **Framework** | Astro 5.7 | Generación de sitios estáticos con hidratación selectiva |  
| **UI** | React 19 | Componentes interactivos del lado del cliente |  
| **Estilos** | TailwindCSS 4.1 | Framework CSS utility-first |  
| **Estado** | Zustand 5.0 | Gestión de estado ligera |  
| **IA** | Google Gemini | Procesamiento de lenguaje natural |  
| **Base de Datos** | Supabase | Backend as a Service |  
| **Autenticación** | Auth.js | OAuth con Google |  
| **Despliegue** | Vercel | Hosting serverless |  
  
## 📋 Requisitos Previos  
  
- Node.js 18+   
- pnpm (gestor de paquetes)  
- Cuenta de Google Cloud (para Gemini API)  
- Cuenta de Supabase  
- Cuenta de Vercel (para despliegue)  
  
## 🔧 Instalación  
  
1. **Clonar el repositorio**  
```bash  
git clone https://github.com/Sebas200702/asistant.git  
cd asistant
Instalar dependencias
pnpm install
Configurar variables de entorno
Crear un archivo .env con:
# Google Gemini AI  [2](#header-2)
GOOGLE_GEMINI_API_KEY=tu_api_key  
  
# Supabase  [3](#header-3)
SUPABASE_URL=tu_supabase_url  
SUPABASE_ANON_KEY=tu_supabase_key  
  
# Auth.js  [4](#header-4)
AUTH_SECRET=tu_secret_aleatorio  
GOOGLE_CLIENT_ID=tu_google_client_id  
GOOGLE_CLIENT_SECRET=tu_google_client_secret
Iniciar servidor de desarrollo
pnpm dev
El servidor estará disponible en http://localhost:4321

📦 Scripts Disponibles
Comando	Acción
pnpm dev	Inicia servidor de desarrollo
pnpm build	Construye el sitio para producción en ./dist/
pnpm preview	Previsualiza la build localmente
pnpm format	Formatea el código con Biome y Prettier
🏗️ Estructura del Proyecto
asistant/  
├── src/  
│   ├── components/          # Componentes React  
│   │   ├── chat.tsx        # Componente principal del chat  
│   │   ├── input.tsx       # Input de mensajes  
│   │   ├── messages.tsx    # Lista de mensajes  
│   │   ├── message-box.tsx # Burbuja de mensaje individual  
│   │   └── markdown-formater.tsx # Renderizador de Markdown  
│   ├── layouts/            # Layouts de Astro  
│   ├── pages/              # Páginas (routing)  
│   │   ├── index.astro    # Página principal  
│   │   └── api/           # Endpoints API  
│   └── stores/            # Stores de Zustand  
├── public/                # Archivos estáticos  
├── astro.config.mjs      # Configuración de Astro  
└── package.json          # Dependencias  
🎨 Componentes Principales
MarkdownFormatter
Renderiza respuestas de IA con formato enriquecido incluyendo:

Resaltado de sintaxis para bloques de código
Soporte para imágenes con vista previa en pantalla completa
Tablas responsivas
Enlaces, listas, citas y más
Chat Interface
Sistema de mensajería que incluye:

Sugerencias predefinidas (programas, costos, admisiones, campus)
Auto-scroll inteligente
Indicadores de carga
Timestamps en mensajes
🔐 Autenticación
El sistema utiliza Auth.js con Google OAuth para autenticación de usuarios. Las sesiones se gestionan automáticamente y permiten:

Historial de chat personalizado
Persistencia de conversaciones
Control de acceso a APIs
🚀 Despliegue
Vercel (Recomendado)
Conecta tu repositorio a Vercel
Configura las variables de entorno
Vercel detectará automáticamente Astro y desplegará
Manual
pnpm build
Los archivos de producción estarán en ./dist/

🤝 Contribuir
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request
📝 Licencia
Este proyecto es privado y pertenece a la Universidad de la Costa.

📧 Contacto
Para preguntas o soporte, contacta al equipo de desarrollo.

Desarrollado con ❤️ para la Universidad de la Costa
