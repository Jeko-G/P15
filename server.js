const express = require('express');
const { Sequelize } = require('sequelize');
const sequelize = require('./config/database');
const Quote = require('./models/quote');

const app = express();
app.use(express.json());

app.get('/api/quotes', async (req, res) => {
  try {
    const randomQuotes = await Quote.findAll({
      order: sequelize.random(),
      limit: 9
    });
    res.json(randomQuotes);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
});

app.get('/quotes', async (req, res) => {
  try {
    const randomQuotes = await Quote.findAll({
      order: sequelize.random(),
      limit: 9
    });

    let htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daily Inspiration</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f2f5; margin: 0; padding: 40px; color: #333; }
          h1 { text-align: center; color: #4a4a4a; margin-bottom: 30px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
          .card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-left: 5px solid #007bff; display: flex; flex-direction: column; justify-content: space-between; }
          .text { font-style: italic; font-size: 1.1rem; line-height: 1.5; margin-bottom: 15px; }
          .author { text-align: right; font-weight: bold; color: #666; }
          .btn-container { text-align: center; margin-top: 40px; }
          .btn { background: #007bff; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 25px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
          .btn:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <h1>✨ Daily Inspiration ✨</h1>
        <div class="grid">
    `;

    randomQuotes.forEach(quote => {
      htmlContent += `
        <div class="card">
          <div class="text">"${quote.text}"</div>
          <div class="author">— ${quote.author}</div>
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div class="btn-container">
          <a href="/quotes" class="btn">Acak Kutipan Baru</a>
        </div>
      </body>
      </html>
    `;

    res.send(htmlContent);
  } catch (error) {
    res.status(500).send('<h1>Terjadi kesalahan server saat memuat halaman.</h1>');
  }
});

const PORT = process.env.PORT || 3000;
sequelize.authenticate()
  .then(() => {
    console.log('Koneksi database berhasil.');
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Gagal koneksi ke database:', err);
  });
