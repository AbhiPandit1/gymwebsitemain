// Importing required modules
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // For converting URL to file path
import databaseConnection from './databaseConnection/database.js'; // Adjust path as necessary
import userRoute from './route/userRoute.js'; // Adjust paths for all routes as necessary
import userAuthRoute from './route/userAuthRoute.js';
import userDetailRoute from './route/userDetailRoute.js';
import programmeRoute from './route/programmeRoute.js';
import trainerRoute from './route/trainerRoute.js';
import paymentRoute from './route/paymentRoute.js';
import forgotPasswordRouter from './route/forgotPasswordRoute.js';
import afterBuyingRouter from './route/afterBuyingRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

const corsOptions = {
  origin: 'https://gymwebsitemain.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Set up CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Adjust to your frontend URL
  credentials: true,
  optionsSuccessStatus: 200
}));

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend build directory if not in development mode
if (process.env.NODE_ENV !== 'development') {
  const staticPath = path.join(__dirname, '../frontend', 'dist');
  app.use(express.static(staticPath));

  // Route for serving the index.html file for any unmatched route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
  });
}

// Set up routes
app.use('/api', userRoute);
app.use('/api', userAuthRoute);
app.use('/api', userDetailRoute);
app.use('/api/admin', programmeRoute);
app.use('/api/trainer', trainerRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/forgot', forgotPasswordRouter);
app.use('/api/after', afterBuyingRouter);

// Start server function
const startServer = async () => {
  try {
    // Establish database connection
    await databaseConnection();

    // Define port to listen on, default to 5000 if not specified in .env
    const port = process.env.PORT || 5000;

    // Start listening on defined port
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to database:', err);
    process.exit(1); // Exit the process with failure
  }
};

// Call startServer function to start the server
startServer();
