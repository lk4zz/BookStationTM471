BigInt.prototype.toJSON = function () {  // dealing with bigInt serialization issue
  return this.toString();
};

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const genresRouter = require('./routes/genres');
const libraryRouter = require('./routes/library');
const commentsRouter = require('./routes/comments');
const followingRouter = require('./routes/following');
const pagesRouter = require('./routes/pages');
const chaptersRouter = require('./routes/chapters');
const walletRouter = require('./routes/wallet');

// Custom Error Handling imports
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/chapters', chaptersRouter);
app.use('/pages', pagesRouter);
app.use('/genres', genresRouter);
app.use('/library', libraryRouter);
app.use('/comments', commentsRouter);
app.use('/following', followingRouter);
app.use('/wallet', walletRouter);

// Catch 404 for any unhandled routes and forward to error handler
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global API error handler
app.use(errorHandler);

module.exports = app;