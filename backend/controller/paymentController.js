import stripePackage from 'stripe';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import Payment from '../model/payementModel.js';
import sendEmail from '../lib/sendEmail.js';
import Programme from '../model/programmeModel.js';
import Trainer from '../model/trainerModel.js';
import cloudinary from 'cloudinary';
import { Types, ObjectId } from 'mongoose';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY_TEST);

export const paymentCheckout = async (req, res) => {
  const { amount } = req.body; // Total amount from the request body
  const userId = req.user._id; // User ID from the request
  const id = req.params.id; // Programme ID
  console.log(process.env.STRIPE_WEBHOOK_SECRET_1);
  try {
    // Check if the programme exists
    const programme = await Programme.findById(id);
    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    // Check if the trainer exists
    const trainer = await Trainer.findOne({ user: programme.trainer });
    if (!trainer) {
      // Remove programme and related Cloudinary image if the trainer is not found
      if (programme.categoryPhoto && programme.categoryPhoto.public_id) {
        const publicId = programme.categoryPhoto.public_id;
        await cloudinary.v2.uploader.destroy(publicId, (error, result) => {
          if (error)
            console.error('Error deleting image from Cloudinary:', error);
          else console.log('Image deleted from Cloudinary:', result);
        });
      }
      await Programme.deleteOne({ _id: id });
      return res
        .status(404)
        .json({ error: 'Trainer not found, programme removed' });
    }

    console.log(trainer.stripeAccountId);

    // Convert ObjectId to string
    const programmeIdString = programme._id.toString();
    const userIdString = userId.toString();
    console.log(programmeIdString);
    console.log(userIdString);

    // Calculate application fee (23% of total amount)
    const applicationFeePercentage = 0.23; // 23%
    const applicationFeeAmount = Math.round(
      amount * applicationFeePercentage * 100
    ); // Convert to cents

    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: programme.title,
              description: programme.description || 'Programme Purchase',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.programpanda.co/payment/success`,
      cancel_url: `https://www.programpanda.co/payment/cancel`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: trainer.stripeAccountId,
        },
        metadata: {
          programmeId: programmeIdString,
          userId: userIdString,
        },
      },
    });

    // Retrieve the payment intent to check metadata
    if (session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );
      console.log('Payment Intent Metadata:', paymentIntent.metadata);
    }

    // Respond with the session ID
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error processing payment:', error);
    res
      .status(500)
      .json({ error: 'Failed to process payment', message: error.message });
  }
};

export const stripeWebhookPayment = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Log the raw event body and signature for debugging purposes

  console.log('Stripe signature:', sig);

  try {
    // Attempt to construct the event from the request body
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_1_TEST
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;

      // Convert userId and programmeId to ObjectId
      const userId = paymentIntent.metadata.userId;
      const programmeId = paymentIntent.metadata.programmeId;

      // Validate ObjectId
      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(programmeId)
      ) {
        console.error('Invalid ObjectId:', userId, programmeId);
        return res.status(400).json({ error: 'Invalid user or programme ID' });
      }

      // Convert valid IDs to ObjectIds
      const userObjectId = new Types.ObjectId(userId);
      const programmeObjectId = new Types.ObjectId(programmeId);

      console.log('Converted userId:', userObjectId);
      console.log('Converted programmeId:', programmeObjectId);

      try {
        // Find the user and programme
        const user = await User.findById(userObjectId);
        const programme = await Programme.findById(programmeObjectId);

        console.log('User found:', user);
        console.log('Programme found:', programme);

        if (!user || !programme) {
          return res.status(404).json({ error: 'User or programme not found' });
        }

        // Update user programme status and save payment details
        user.hasTakenProgramme = true;
        user.takenProgrammes.push(programmeObjectId);
        await user.save();
        console.log('User programme status updated and saved.');

        // Save payment details
        const paymentDetails = new Payment({
          userId: userObjectId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          programmes: [programme._id],
        });
        await paymentDetails.save();
        console.log('Payment details saved:', paymentDetails);

        // Send confirmation email
        const emailData = {
          email: user.email,
          subject: 'Purchase Confirmation',
          message: `Thank you for your purchase of ${
            paymentIntent.amount / 100
          } USD. Your payment ID is ${paymentIntent.id}.`,
        };
        await sendEmail(emailData);
        console.log('Confirmation email sent:', emailData);

        console.log('Payment successful, actions completed.');
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error processing payment success:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    case 'payment_intent.canceled': {
      const paymentIntent = event.data.object;
      console.log('Payment Intent (Canceled):', paymentIntent);

      // Convert userId and programmeId to ObjectId
      const userId = paymentIntent.metadata.userId;
      const programmeId = paymentIntent.metadata.programmeId;

      // Validate ObjectId
      if (
        !Types.ObjectId.isValid(userId) ||
        !Types.ObjectId.isValid(programmeId)
      ) {
        console.error('Invalid ObjectId:', userId, programmeId);
        return res.status(400).json({ error: 'Invalid user or programme ID' });
      }

      const userObjectId = new Types.ObjectId(userId);
      const programmeObjectId = new Types.ObjectId(programmeId);

      console.log('Converted userId:', userObjectId);
      console.log('Converted programmeId:', programmeObjectId);

      try {
        const user = await User.findById(userObjectId);
        console.log('User found for cancellation:', user);

        // Send cancellation email
        if (user) {
          const emailData = {
            email: user.email,
            subject: 'Payment Canceled',
            message: `Your payment for programme ID ${programmeObjectId} was canceled.`,
          };
          await sendEmail(emailData);
          console.log('Cancellation email sent:', emailData);
        }

        console.log('Payment canceled, email sent.');
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error processing payment cancellation:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
      return res.status(200).json({ received: true }); // Acknowledge receipt of the event
  }
};

// Refund Method
export const refundForPayment = async (req, res) => {
  const { paymentIntentId } = req.body;
  const userId = req.user._id;

  try {
    // Retrieve the Payment Intent to check its details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if the payment intent has a successful charge
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Cannot refund',
        message:
          'This PaymentIntent does not have a successful charge to refund.',
      });
    }

    // Check if the payment was created within the last 7 days
    const paymentCreatedAt = paymentIntent.created;
    const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // Timestamp for 7 days ago

    if (paymentCreatedAt < sevenDaysAgo) {
      return res.status(400).json({
        error: 'Refund period has expired',
        message: 'Refunds can only be processed within 7 days of payment.',
      });
    }

    // Check if the payment intent belongs to the same user
    const paymentRecord = await Payment.findOne({ paymentIntentId, userId });
    if (!paymentRecord) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to refund this payment.',
      });
    }

    // Process the refund
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

export const paymentDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming user.paymentIntents is an array of payment intent IDs
    const paymentIds = await Promise.all(
      user.paymentIntents.map(async (paymentIntentId) => {
        const payments = await Payment.find({ paymentIntentId }).populate(
          'programmes',
          'name'
        ); // Fetch payments based on paymentIntentId
        return payments;
      })
    );

    return res.status(200).json({ payments: paymentIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Account
export const createAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'No user found with this ID' });
    }

    // Check if a trainer profile already exists for the user
    let trainer = await Trainer.findOne({ user: userId });

    // If no trainer profile exists, create one
    if (!trainer) {
      trainer = new Trainer({ user: userId });
    }

    // Check if the trainer already has a Stripe account and it's not fully linked
    if (trainer.stripeAccountId) {
      // Check if the account is restricted
      const account = await stripe.accounts.retrieve(trainer.stripeAccountId);

      if (
        account.capabilities &&
        !account.capabilities.card_payments === 'active'
      ) {
        // Account is restricted, guide user to complete their profile
        const accountLink = await stripe.accountLinks.create({
          account: trainer.stripeAccountId,
          refresh_url: `https://www.programpanda.co/account/link/success`,
          return_url: `https://www.programpanda.co/account/link/return`,
          type: 'account_onboarding',
        });

        return res.status(200).json({ url: accountLink.url });
      }

      // If the account is already linked, redirect them to the dashboard
      if (trainer.stripeAccountLinked) {
        const accountDashboardLink = await stripe.accounts.createLoginLink(
          trainer.stripeAccountId
        );
        return res.status(200).json({ url: accountDashboardLink.url });
      }
    }

    // If no Stripe account exists, create a new Stripe account for the trainer
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
    });

    // Update the trainer's Stripe account ID and mark the account as not linked yet
    trainer.stripeAccountId = account.id;

    await trainer.save();

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `https://www.programpanda.co/account/link/success`,
      return_url: `https://www.programpanda.co/account/link/return`,
      type: 'account_onboarding',
    });

    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Create Account
