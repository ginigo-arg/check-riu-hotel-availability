# Verificador de Disponibilidad Hotel Riu Tequila

Esta aplicación automatiza la verificación de disponibilidad de habitaciones en el Hotel Riu Tequila y envía notificaciones por correo electrónico cuando hay disponibilidad.

## 🚀 Características

- Verificación automática de disponibilidad cada 30 minutos
- Notificaciones por correo electrónico
- Sistema anti-bloqueo con User-Agent aleatorio
- Manejo de errores robusto
- Sistema de bloqueo para evitar múltiples instancias
- Logging detallado

## 📋 Requisitos Previos

- Node.js
- PM2 (para gestión de procesos)
- Cuenta de Gmail (para envío de notificaciones)

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone [url-del-repositorio]
cd riu-availability-checker
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` con la siguiente información:

```
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
RIU_URL=url-del-hotel
```

## 🚀 Uso

### Scripts Disponibles

- `npm run dev`: Ejecuta la aplicación en modo desarrollo
- `npm start`: Inicia la aplicación con PM2
- `npm run stop`: Detiene la aplicación
- `npm run restart`: Reinicia la aplicación
- `npm run logs`: Muestra los logs de la aplicación
- `npm run monitor`: Abre el monitor de PM2
- `npm run delete`: Elimina la aplicación de PM2

## 🛠️ Tecnologías Utilizadas

- Puppeteer - Para web scraping
- Nodemailer - Para envío de correos
- PM2 - Para gestión de procesos
- dotenv - Para manejo de variables de entorno
- user-agents - Para rotación de User-Agents

## 📦 Dependencias

```json
{
  "puppeteer": "^21.0.0",
  "user-agents": "^1.0.1144",
  "nodemailer": "^6.9.0",
  "dotenv": "^16.0.3"
}
```

## 📝 Configuración de PM2

La aplicación está configurada para ejecutarse con PM2 con las siguientes características:

- Reinicio automático cada 30 minutos
- Límite de memoria: 200MB
- Modo de ejecución: fork
- Logs automáticos con formato de fecha

## 📄 Licencia

ISC

## ✨ Funcionalidades Detalladas

- Verificación automática de disponibilidad
- Captura de información detallada del hotel:
  - Nombre del hotel
  - Ubicación
  - Calificación de TripAdvisor
  - Número de opiniones
  - Servicios disponibles
  - Estado de disponibilidad
- Notificaciones por correo con información detallada
- Sistema de bloqueo para evitar múltiples instancias simultáneas
- Manejo de errores y recuperación automática
- Logging detallado para monitoreo y debugging

## 🤝 Contribuir

Si deseas contribuir al proyecto, por favor:

1. Haz un Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
