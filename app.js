require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
require('express-async-errors')

const connectDB=require('./db/connect')
const productRouter = require('./routes/products')

// error handler

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('<h1>Store Api</h1><a href="/api/v1/products">Products Routes</a>');
});


app.use('/api/v1/products' , productRouter)
//products middleware

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    //connectDB
    await connectDB (process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`) );
  } catch (error) {
    console.log(error);
  }
};

start();
