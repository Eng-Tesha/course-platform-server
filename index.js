const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/courses',  require('./routes/courses'));
app.use('/api/enroll',   require('./routes/enroll'));
app.use('/api/progress', require('./routes/progress'));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
   /* app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });*/
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });