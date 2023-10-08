const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('server started at port 3000');
});

const userRouter = require('./routers/userRouter');
const planRouter = require('./routers/planRouter');
const reviewRouter = require('./routers/reviewRouter');

// Routes
app.use('/user', userRouter);
app.use('/plan', planRouter);
app.use('/review', reviewRouter);
