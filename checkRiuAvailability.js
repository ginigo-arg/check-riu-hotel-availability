const puppeteer = require("puppeteer");
const UserAgent = require("user-agents");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(availability, url, hasAvailability) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "gabrielinigo99@gmail.com",
      subject: hasAvailability
        ? "¡Disponibilidad Hotel Riu Tequila 5 🏨✅❕❕!"
        : "No Disponible Hotel Riu Tequila 5 🥹⛔️",
      html: hasAvailability
        ? `
          <h2>Se ha encontrado disponibilidad en Hotel Riu Tequila 5 🏨✅❕❕</h2>
          <p>Detalles de las habitaciones disponibles:</p>
          <pre>${JSON.stringify(availability, null, 2)}</pre>
          <p>Puedes reservar en el siguiente enlace:</p>
          <a href="${url}">Reservar ahora</a>
          <p>Fecha de verificación: ${new Date().toLocaleString()}</p>
        `
        : `
          <h2>No hay disponibilidad en el Hotel Riu Tequila 5 🥹⛔️</h2>
          <p>Fecha de verificación: ${new Date().toLocaleString()}</p>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
}

async function checkRiuHotelAvailability() {
  const lockFile = path.join(__dirname, "check-riu.lock");

  // Verificar si ya hay una instancia ejecutándose
  if (fs.existsSync(lockFile)) {
    console.log("Ya hay una instancia ejecutándose. Saliendo...");
    return;
  }

  // Crear archivo de bloqueo
  fs.writeFileSync(lockFile, new Date().toISOString());

  let browser;
  let emailSent = false; // Flag para controlar el envío de correos

  try {
    console.log("Iniciando el proceso de verificación...");

    browser = await puppeteer.launch({
      headless: "false",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--remote-debugging-port=0", // Asigna un puerto aleatorio
      ],
      ignoreHTTPSErrors: true,
      timeout: 120000, // Aumentado a 120 segundos
    });

    console.log("Navegador iniciado correctamente");
    const page = await browser.newPage();

    // Configurar timeouts más largos para la página
    await page.setDefaultNavigationTimeout(120000);
    await page.setDefaultTimeout(120000);

    // Manejar errores de WebSocket
    page.on("error", (err) => {
      console.error("Error en la página:", err);
    });

    page.on("pageerror", (err) => {
      console.error("Error en el JavaScript de la página:", err);
    });

    console.log("Configurando User Agent...");
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());

    const url = process.env.RIU_URL;
    if (!url) {
      throw new Error("RIU_URL no está definida en el archivo .env");
    }

    console.log(`Navegando a ${url}...`);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000, // 60 segundos de timeout para la carga de la página
    });

    console.log("Página cargada, evaluando contenido...");
    const availability = await page.evaluate(() => {
      const hotelSection = document.querySelector(
        ".riu-hotels-list:first-child"
      );
      if (!hotelSection) return null;
      console.log("hotelSection= ", hotelSection);
      const hotelInfo = {
        nombre: hotelSection
          .querySelector(".riu-card-hotel__hotel-name")
          ?.textContent.trim(),
        ubicacion: hotelSection
          .querySelector(".riu-button__content")
          ?.textContent.trim(),
        imagen: hotelSection.querySelector(".riu-card-hotel__image")?.src,
        rating: hotelSection
          .querySelector(".riu-trip-advisor__rating-text")
          ?.textContent.trim(),
        opiniones: hotelSection
          .querySelector(".riu-trip-advisor__num-reviews-text")
          ?.textContent.trim(),
        servicios: Array.from(
          hotelSection.querySelectorAll(".riu-card-hotel__services-item")
        ).map((service) => service.getAttribute("data-qa")),
        disponibilidad: !hotelSection.querySelector(".riu-note"),
        mensaje: hotelSection.querySelector(".riu-note")?.textContent.trim(),
        timestamp: new Date().toISOString(),
      };

      return hotelInfo;
    });

    console.log(
      "Resultados de disponibilidad:",
      JSON.stringify(availability, null, 2)
    );

    // Verificar disponibilidad y enviar correo correspondiente (solo si no se ha enviado)
    if (!emailSent) {
      if (availability && availability.disponibilidad) {
        await sendEmail(availability, url, true);
        console.log(
          "Se ha enviado un correo con la disponibilidad encontrada."
        );
      } else {
        await sendEmail(availability, url, false);
        console.log(
          "Se ha enviado un correo indicando que no hay disponibilidad."
        );
      }
      emailSent = true;
    }

    // Agregar un pequeño retraso antes de cerrar el navegador
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await browser.close();
    console.log("Verificación completada:", new Date().toLocaleString());
  } catch (error) {
    console.error("Error durante la ejecución:", error);
    if (browser) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await browser.close();
      } catch (closeError) {
        console.error("Error al cerrar el navegador:", closeError);
      }
    }
    throw error;
  } finally {
    // Eliminar archivo de bloqueo al terminar
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  }
}

// Modificar la ejecución para que solo se ejecute una vez
checkRiuHotelAvailability().catch((error) => {
  console.error("Error en la ejecución principal:", error);
  process.exit(1);
});
