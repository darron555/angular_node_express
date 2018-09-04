const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const analyticRoutes = require('./routes/analytic');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
const positionRoutes = require('./routes/position');
const cors = require('cors');
const morgan = require('morgan');
const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURI, {useNewUrlParser: true})
    .then(() => {
        console.log('mongo db connected');
    })
    .catch(error => console.log('error'));

app.use(passport.initialize({}));
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/analytic', analyticRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionRoutes);

module.exports = app;