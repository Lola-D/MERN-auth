require('dotenv').config({path: './config.env'});
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_PUBLIC_URL || 'http://localhost:3000',
  })
);
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/private', require('./routes/private'));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});

// if something get wrong with connection to the server,
// it send a more readable error message before exit.
process.on('unhandledRejection', (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
