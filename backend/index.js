// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';

// Import route modules
import databaseConnection from './databaseConnection/database.js';
import userRoute from './route/userRoute.js';
import userAuthRoute from './route/userAuthRoute.js';
import userDetailRoute from './route/userDetailRoute.js';
import programmeRoute from './route/programmeRoute.js';
import trainerRoute from './route/trainerRoute.js';
import paymentRoute from './route/paymentRoute.js';
import forgotPasswordRouter from './route/forgotPasswordRoute.js';
import afterBuyingRouter from './route/afterBuyingRoute.js';
import adminRoute from './route/adminRoute.js';
import settingRouter from './route/settingRoute.js';
import programmeDietPlanRouter from './route/programmeDietPlanRoute.js';
import programmeDayPlanRouter from './route/programmeDayPlanRoute.js';
import reviewPlanRouter from './route/reviewRoute.js';
import {
  stripeWebhook,
  stripeWebhookPayment,
} from './controller/paymentController.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Raw body for Stripe//payment_intent.succeeded
  stripeWebhookPayment // Your webhook handling function
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/webhook/account',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Configure CORS
const corsOptions = {
  origin: '*', // For security, specify allowed origins if possible
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// Set up API routes
app.use('/api', userRoute);
app.use('/api', userAuthRoute);
app.use('/api', userDetailRoute);
app.use('/api/admin', programmeRoute);
app.use('/api/trainer', trainerRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/forgot', forgotPasswordRouter);
app.use('/api/after', afterBuyingRouter);
app.use('/api/admin/route', adminRoute);
app.use('/api/setting', settingRouter);
app.use('/api/trainer', programmeDietPlanRouter);
app.use('/api/trainer', programmeDayPlanRouter);
app.use('/api', reviewPlanRouter);

// Serve static files (if any)
// Uncomment and adjust the path if you have static files to serve
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// Webhook route

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
    app.listen(process.env.PORT || 3001, () => {
      console.log(
        `Server is running on http://localhost:${process.env.PORT || 3001}`
      );
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1); // Exit the process with failure
  }
};

// Call startServer function to start the server
startServer();
