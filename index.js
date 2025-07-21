// index.js
const express = require('express');
const connectDB = require('./db/db.js');
const companyRoutes = require('./routes/companyRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const app = express();
const PORT = 3000;
const path = require('path');
const cors = require('cors');
app.use(cors());
// Middleware
app.use(express.json()); // Đọc JSON body

// Kết nối DB
connectDB();
app.use(express.static(path.join(__dirname, 'frontend')));
// Routes
app.use('/companies', companyRoutes);

app.use('/recipes', recipeRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
