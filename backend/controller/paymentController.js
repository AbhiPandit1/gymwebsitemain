import stripePackage from 'stripe';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import Payment from '../model/payementModel.js';
import sendEmail from '../lib/sendEmail.js';
import Programme from '../model/programmeModel.js';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const endpointSecret =
  'whsec_141d5dd7bbd1b74262e4bd332047195dd18083ae6ba9f9b4a9f32f8b020e0b23';

export const paymentCheckout = async (req, res) => {
  const { amount, country } = req.body; // Destructure amount and country
  const userId = req.user._id.toString(); // Ensure this is a string
  console.log('User ID:', userId);
  const id = req.params.id;

  try {
    // Ensure the currency is set correctly based on country if needed
    const currency = 'usd'; // Assuming you are using USD for the example

    const programme = await Programme.findById(id);
    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    const user = await User.findById(userId);
    if (user.takenProgrammes.includes(id)) {
      return res.status(400).json({ error: "You can't buy a programme twice" });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      description: 'Product',
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'product',
              // Add description or other fields if needed
            },
            unit_amount: amount, // Amount in the smallest currency unit (e.g., cents for USD)
          },
          quantity: 1, // Number of items
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      client_reference_id: userId, // Ensure this is a valid string
      metadata: {
        paymentIntentId: paymentIntent.id,
        programmeId: id,
      },
    });

    // Save payment details
    const paymentDetails = new Payment({
      userId: userId,
      amount: amount / 100, // Convert amount to dollars if needed for storage
      currency: currency,
      paymentIntentId: paymentIntent.id,
      programmes: [programme],
    });
    await paymentDetails.save();
    console.log(user, paymentDetails, paymentIntent.id);

    res.json({
      id: session.id,
      paymentIntentId: paymentIntent.id,
      user: user,
      paymentDetails,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res
      .status(500)
      .json({ error: 'Failed to process payment', message: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  console.log('Webhook triggered');
  const sig = req.headers['stripe-signature'];
  console.log('Stripe Signature:', sig);
  let event;

  try {
    // Construct the Stripe event from the raw body and signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook Event:', event);
  } catch (err) {
    // Handle errors related to webhook signature verification
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Define and call a function to handle the event checkout.session.async_payment_failed
      console.log(
        'Checkout session async payment failed:',
        checkoutSessionAsyncPaymentFailed
      );
      break;

    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Define and call a function to handle the event checkout.session.async_payment_succeeded
      console.log(
        'Checkout session async payment succeeded:',
        checkoutSessionAsyncPaymentSucceeded
      );
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
      // Define and call a function to handle the event checkout.session.expired
      console.log('Checkout session expired:', checkoutSessionExpired);
      break;

    case 'payment_intent.amount_capturable_updated':
      const paymentIntentAmountCapturableUpdated = event.data.object;
      // Define and call a function to handle the event payment_intent.amount_capturable_updated
      console.log(
        'Payment intent amount capturable updated:',
        paymentIntentAmountCapturableUpdated
      );
      break;

    case 'payment_intent.canceled':
      const paymentIntentCanceled = event.data.object;
      // Define and call a function to handle the event payment_intent.canceled
      console.log('Payment intent canceled:', paymentIntentCanceled);
      break;

    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      // Define and call a function to handle the event payment_intent.created
      console.log('Payment intent created:', paymentIntentCreated);
      break;

    case 'payment_intent.partially_funded':
      const paymentIntentPartiallyFunded = event.data.object;
      // Define and call a function to handle the event payment_intent.partially_funded
      console.log(
        'Payment intent partially funded:',
        paymentIntentPartiallyFunded
      );
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
      // Define and call a function to handle the event payment_intent.processing
      console.log('Payment intent processing:', paymentIntentProcessing);
      break;

    case 'payment_intent.requires_action':
      const paymentIntentRequiresAction = event.data.object;
      // Define and call a function to handle the event payment_intent.requires_action
      console.log(
        'Payment intent requires action:',
        paymentIntentRequiresAction
      );
      break;

    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Define and call a function to handle the event payment_intent.succeeded
      console.log('Payment intent succeeded:', paymentIntentSucceeded);
      break;

    case 'refund.created':
      const refundCreated = event.data.object;
      // Define and call a function to handle the event refund.created
      console.log('Refund created:', refundCreated);
      break;

    case 'refund.updated':
      const refundUpdated = event.data.object;
      // Define and call a function to handle the event refund.updated
      console.log('Refund updated:', refundUpdated);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Respond to Stripe indicating the event was received and processed
  res.status(200).send('Event received');
};

// Refund Method
export const refundForPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user._id;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Cannot refund',
        message:
          'This PaymentIntent does not have a successful charge to refund.',
      });
    }

    const paymentCreatedAt = paymentIntent.created;
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

    if (paymentCreatedAt < sevenDaysAgo) {
      return res.status(400).json({
        error: 'Refund period has expired',
        message: 'Refunds can only be processed within 7 days of payment.',
      });
    }

    const paymentRecord = await Payment.findOne({ paymentIntentId, userId });
    if (!paymentRecord) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to refund this payment.',
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res.json({ success: true, refund });
  } catch (error) {
    console.error('Error processing refund:', error);
    res
      .status(500)
      .json({ error: 'Failed to process refund', message: error.message });
  }
};

// Payment Details Method
export const paymentDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentRecords = await Payment.find({ userId: id }).populate(
      'programmes',
      'name'
    );

    return res.status(200).json({ payments: paymentRecords });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
