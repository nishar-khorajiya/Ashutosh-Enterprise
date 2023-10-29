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

app.use(cors({
  origin: 'http://localhost:3000',
  exposedHeaders: 'Authorization',
  exposedHeaders: 'user',
}));
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
