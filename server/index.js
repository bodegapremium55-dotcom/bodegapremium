require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configurar Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-YOUR-TOKEN' });

// 2. Configurar Nodemailer (Google SMTP)
// IMPORTANTE: Para usar Gmail, debes generar una "Contraseña de Aplicación" en la seguridad de tu cuenta Google.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'tu_correo@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'tu_contraseña_de_aplicacion'
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Bodega Premium Funcionando');
});

// Endpoint para crear preferencia de Mercado Pago
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, user } = req.body;
    
    // Crear la preferencia
    const preference = new Preference(client);
    
    const mpItems = items.map(item => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'CLP',
      picture_url: item.imageUrl
    }));

    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          email: user?.email || 'invitado@mail.com',
          name: user?.name || 'Invitado'
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/success`,
          failure: `${process.env.FRONTEND_URL}/failure`,
          pending: `${process.env.FRONTEND_URL}/pending`
        },
        auto_return: 'approved',
        // Esto envía notificaciones al backend cuando se paga
        notification_url: `${process.env.BACKEND_URL}/api/webhook` 
      }
    });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear pago' });
  }
});

// Endpoint que recibe el Webhook de Mercado Pago
app.post('/api/webhook', async (req, res) => {
  const { type, data } = req.body;
  
  if (type === 'payment') {
    try {
      // Aquí consultarías a Mercado Pago el estado del pago data.id
      // Si está 'approved', envías el correo.
      console.log('Pago recibido, ID:', data.id);

      // Simulación de envío de correo de confirmación
      // Obtener el email del comprador (en producción se saca de la consulta a la API de MP)
      const buyerEmail = 'cliente@test.com'; 
      
      const mailOptions = {
        from: `"Bodega Premium" <${process.env.GMAIL_USER}>`,
        to: buyerEmail,
        subject: '¡Tu pedido está confirmado! 🍷',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #e53935;">¡Gracias por tu compra!</h1>
            <p>Tu pedido en <strong>Bodega Premium</strong> ha sido procesado exitosamente mediante Mercado Pago.</p>
            <p>Estamos preparando tus vinos para el envío directo desde el Valle del Maule.</p>
            <hr />
            <p>Si tienes dudas, contáctanos a este mismo correo.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Correo de confirmación enviado exitosamente.');

    } catch (error) {
      console.error('Error procesando el webhook:', error);
    }
  }

  res.sendStatus(200);
});

// Endpoint para simular enviar un correo directo (ej. Bienvenida)
app.post('/api/send-welcome', async (req, res) => {
  const { email, name } = req.body;

  try {
    const mailOptions = {
      from: `"Bodega Premium" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Bodega Premium! 🍇',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #e53935;">¡Hola ${name}!</h1>
          <p>Gracias por unirte o interactuar con nuestra plataforma.</p>
          <p>Te invitamos a revisar nuestra selección exclusiva.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo enviado' });
  } catch (error) {
    console.error('Error enviando correo de bienvenida:', error);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
