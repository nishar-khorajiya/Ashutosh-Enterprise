import express from 'express'
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRotes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url';


//env config
dotenv.config();

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//const allowedOrigins = ['http://localhost:3000', 'https://super-plum-hippo.cyclic.app/'];
// app.use(cors({
//   origin: 'https://super-plum-hippo.cyclic.app',
//   exposedHeaders: 'Authorization',
//   exposedHeaders: 'user',
// }));
  app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", 'Content-Type' ,'user','Authorization');
      next();
    });

//database
connectDB();

app.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//middelwares
app.use(express.json());
app.use(morgan('dev'));
app.set('case sensitive routing', true);
app.set('strict routing', true);

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRotes);
app.use('/api/v1/product', productRoutes);
app.use(express.static(path.join(__dirname,'./frontend/build')))
const port = process.env.PORT || 8080;

app.get('*', function(req, res) {

  res.sendFile(path.join(__dirname,'./frontend/build/index.html'))
})

app.listen(port, () => {
  console.log(`server running on ${port}`);
})
