const express = require('express');
const path = require('path');
const passport = require('./config/passport');
const session = require('./config/session');
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session);
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/file', fileRouter);
app.use('/', indexRouter);

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`))