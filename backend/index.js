// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import bodyParser from 'body-parser';
import stripe from 'stripe';

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
import User from './model/userModel.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe client
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

// Initialize Express application
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Serve static files (if any)
// Uncomment and adjust the path if you have static files to serve
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// Webhook route
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    console.log('Webhook triggered');
    const sig = req.headers['stripe-signature'];
    console.log('Stripe Signature:', sig);
    let event;

    try {
      // Construct the Stripe event from the raw body and signature
      event = stripeClient.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
      console.log('Webhook Event:', event);
    } catch (err) {
      // Handle errors related to webhook signature verification
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        console.log(
          'Checkout session async payment failed:',
          checkoutSessionAsyncPaymentFailed
        );
        // Handle async payment failure
        break;

      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(
          'Checkout session async payment succeeded:',
          checkoutSessionAsyncPaymentSucceeded
        );
        // Handle async payment success
        break;

      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        const userId = checkoutSessionCompleted.client_reference_id;
        const paymentIntentId = checkoutSessionCompleted.payment_intent;
        const programmeId = checkoutSessionCompleted.metadata.programmeId;

        try {
          const user = await User.findById(userId);
          if (user && !user.takenProgrammes.includes(programmeId)) {
            user.takenProgrammes.push(programmeId);
            user.paymentIntents.push(paymentIntentId);
            await user.save();

            const emailData = {
              email: user.email,
              subject: 'Purchase Confirmation',
              message: `Thank you for your purchase. Your payment ID is ${paymentIntentId}.`,
            };
            await sendEmail(emailData);
          }
        } catch (error) {
          console.error('Error updating user after successful payment:', error);
        }
        break;

      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        console.log('Checkout session expired:', checkoutSessionExpired);
        // Handle expired checkout session
        break;

      case 'payment_intent.amount_capturable_updated':
        const paymentIntentAmountCapturableUpdated = event.data.object;
        console.log(
          'Payment intent amount capturable updated:',
          paymentIntentAmountCapturableUpdated
        );
        // Handle capturable amount update
        break;

      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object;
        console.log('Payment intent canceled:', paymentIntentCanceled);
        // Handle payment intent cancellation
        break;

      case 'payment_intent.created':
        const paymentIntentCreated = event.data.object;
        console.log('Payment intent created:', paymentIntentCreated);
        // Handle payment intent creation
        break;

      case 'payment_intent.partially_funded':
        const paymentIntentPartiallyFunded = event.data.object;
        console.log(
          'Payment intent partially funded:',
          paymentIntentPartiallyFunded
        );
        // Handle partially funded payment intent
        break;

      case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed = event.data.object;
        try {
          const user = await User.findOne({
            paymentIntents: paymentIntentPaymentFailed.id,
          });
          if (user) {
            const emailData = {
              email: user.email,
              subject: 'Unsuccessful Transaction',
              message: `Your transaction for ${
                paymentIntentPaymentFailed.amount / 100
              } USD was unsuccessful. Please try again.`,
            };
            await sendEmail(emailData);
          }
        } catch (error) {
          console.error('Error handling payment failure:', error);
        }
        break;

      case 'payment_intent.processing':
        const paymentIntentProcessing = event.data.object;
        console.log('Payment intent processing:', paymentIntentProcessing);
        // Handle payment intent processing
        break;

      case 'payment_intent.requires_action':
        const paymentIntentRequiresAction = event.data.object;
        console.log(
          'Payment intent requires action:',
          paymentIntentRequiresAction
        );
        // Handle payment intent requiring action
        break;

      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log('Payment intent succeeded:', paymentIntentSucceeded);
        // Handle successful payment intent
        break;

      case 'refund.created':
        const refundCreated = event.data.object;
        console.log('Refund created:', refundCreated);
        // Handle refund creation
        break;

      case 'refund.updated':
        const refundUpdated = event.data.object;
        console.log('Refund updated:', refundUpdated);
        // Handle refund update
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Respond to Stripe indicating the event was received and processed
    res.status(200).send('Event received');
  }
);

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
