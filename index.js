const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/products', productRoutes);
app.use('/users', userRoutes);

let allowedOrigins = ['http://localhost:3001', 'http://localhost:1234', 'http://localhost:4200', 'https://alqatrony.github.io'];

// Import Passport.js configurations
require('./config/passport')(passport);

const MONGO_URI = 'mongodb://localhost:27017/swar_al-raqiyat_DB';

// Comment this before puhsing to HEROKU
mongoose.connect('mongodb+srv://Alqatrony:Al1357912345678@alqatronycluster.mxoml6c.mongodb.net/swar_al-raqiyat_DB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// connecting to the database
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Failed to connect to MongoDB:', err));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});