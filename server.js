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

// Endpoint B: /quotes -> Menampilkan halaman web persis sesuai gambar
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
          * { box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f3f4f6; 
            margin: 0; 
            padding: 0; 
            color: #333; 
          }
          /* Header Ungu Melengkung sesuai gambar */
          .header {
            background: #6f42c1;
            color: white;
            text-align: center;
            padding: 60px 20px 80px 20px;
            border-bottom-left-radius: 50% 20px;
            border-bottom-right-radius: 50% 20px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5rem;
            font-weight: bold;
          }
          .header p {
            margin: 0;
            font-size: 1.1rem;
            opacity: 0.9;
          }
          /* Container Grid */
          .main-container {
            max-width: 1200px;
            margin: -40px auto 40px auto;
            padding: 0 20px;
          }
          .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
            gap: 25px; 
          }
          /* Card Gaya Baru */
          .card { 
            background: white; 
            padding: 30px; 
            border-radius: 16px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
            display: flex; 
            flex-direction: column; 
            justify-content: space-between;
            position: relative;
            min-height: 200px;
          }
          /* Ikon Kutipan Ganda Ungu */
          .card::before {
            content: "“";
            position: absolute;
            top: 10px;
            left: 20px;
            font-size: 4rem;
            color: #e2d9f3;
            font-family: Georgia, serif;
            line-height: 1;
          }
          .text { 
            font-style: italic; 
            font-size: 1.15rem; 
            line-height: 1.6; 
            margin-top: 20px;
            margin-bottom: 20px;
            color: #4a4a4a;
            z-index: 1;
          }
          .author { 
            text-align: right; 
            font-weight: bold; 
            color: #6f42c1; /* Warna nama author ungu menyesuaikan tema */
            font-size: 1rem;
          }
          /* Tombol Acak di bagian bawah */
          .btn-container { text-align: center; margin-top: 50px; margin-bottom: 50px; }
          .btn { 
            background: #6f42c1; 
            color: white; 
            border: none; 
            padding: 14px 32px; 
            font-size: 1rem; 
            font-weight: bold;
            border-radius: 30px; 
            cursor: pointer; 
            text-decoration: none; 
            box-shadow: 0 5px 15px rgba(111, 66, 193, 0.3);
            transition: all 0.2s; 
          }
          .btn:hover { background: #5a32a3; transform: translateY(-2px); }
        </style>
      </head>
      <body>

        <div class="header">
          <h1>Daily Inspiration For You</h1>
          <p>Koleksi kata-kata mutiara</p>
        </div>

        <div class="main-container">
          <div class="grid">
    `;

    randomQuotes.forEach(quote => {
      htmlContent += `
        <div class="card">
          <div class="text">${quote.text}</div>
          <div class="author">— ${quote.author}</div>
        </div>
      `;
    });

    htmlContent += `
          </div>
          <div class="btn-container">
            <a href="/quotes" class="btn">Acak Kutipan Baru</a>
          </div>
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
