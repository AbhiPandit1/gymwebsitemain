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

// Define port to listen on, default to 3001 if not specified in .env
const port = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specific headers
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Setup static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, '../frontend2', 'dist');

app.use(express.static(staticPath));

// Route for serving the index.html file for any unmatched route

// Set up API routes
app.use('/api', userRoute);
app.use('/api', userAuthRoute);
app.use('/api', userDetailRoute);
app.use('/api/admin', programmeRoute);
app.use('/api/trainer', trainerRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/forgot', forgotPasswordRouter);
app.use('/api/after', afterBuyingRouter);

// Error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handling for server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start server function
const startServer = async () => {
  try {
    // Establish database connection
    await databaseConnection();

    // Start listening on the defined port
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Serving static files from: ${staticPath}`);
    });
  } catch (err) {
    console.error('Unable to connect to database:', err);
    process.exit(1); // Exit the process with failure
  }
};

// Call startServer function to start the server
startServer();
