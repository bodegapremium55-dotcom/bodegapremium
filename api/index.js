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

// 2. Configurar Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.send('API de Bodega Premium en Vercel Funcionando');
});

// Endpoint para crear preferencia de Mercado Pago
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, user } = req.body;
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
        notification_url: `${process.env.BACKEND_URL}/api/webhook` 
      }
    });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear pago' });
  }
});

// Webhook de Mercado Pago
app.post('/api/webhook', async (req, res) => {
  const { type, data } = req.body;
  if (type === 'payment') {
    try {
      console.log('Pago recibido, ID:', data.id);
      const buyerEmail = 'cliente@test.com'; // En prod se obtiene de la API de MP
      
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
    } catch (error) {
      console.error('Error procesando el webhook:', error);
    }
  }
  res.sendStatus(200);
});

// Correo de bienvenida
app.post('/api/send-welcome', async (req, res) => {
  const { email, name } = req.body;
  try {
    const mailOptions = {
      from: `"Bodega Premium" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a Bodega Premium! 🍇',
      html: `<h1 style="color: #e53935;">¡Hola ${name}!</h1><p>Gracias por unirte a nuestra plataforma.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error enviando correo' });
  }
});

// Exportar la app para Vercel
module.exports = app;
