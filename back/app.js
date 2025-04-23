// app.js
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('API funcionando'));
app.listen(3000, () => console.log('Backend en http://localhost:3000'));
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tuBase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));
