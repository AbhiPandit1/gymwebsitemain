import stripePackage from 'stripe';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import Payment from '../model/payementModel.js';
import sendEmail from '../lib/sendEmail.js';
import Programme from '../model/programmeModel.js';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const paymentCheckout = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;
  console.log(userId);
  

  // Validate id parameter
  const id = req.params.id;

  try {
    // Check if the Programme exists
    const programme = await Programme.findById(id);
    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }
    const user = await User.findById(userId);
    
    

    if (user.takenProgrammes.includes(id)) {
      return res.status(404).json({ error: 'You cant buy a programme twice' });
    }

    // Create a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      description: 'Your Product Name',
    });

    // Create a Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Product Name',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/payment/success',
      cancel_url: 'http://localhost:5173/payment/cancel',
      payment_intent_data: {
        metadata: { paymentIntentId: paymentIntent.id },
      },
    });

    // Update user's hasTakenProgramme to true
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { hasTakenProgramme: true },
      { new: true }
    );

    // Save payment details
    const paymentDetails = new Payment({
      userId: userId,
      amount: amount,
      currency: 'usd',
      paymentIntentId: paymentIntent.id,
      programmes: [programme], // Assuming id is the ObjectId of the programme
    });
    await paymentDetails.save();

    // Add the paymentIntentId to the user's paymentIntents array
    updatedUser.paymentIntents.push(paymentIntent.id);
    updatedUser.takenProgrammes.push(id);

    await updatedUser.save();

    // Send email confirmation
    const emailData = {
      email: updatedUser.email,
      subject: 'Purchase Confirmation',
      message: `Thank you for your purchase of ${amount} USD. Your payment ID is ${paymentIntent.id}. and details ${paymentDetails}`,
    };
    await sendEmail(emailData);

    // Return session ID, Payment Intent ID, and updated user data to client
    res.json({
      id: session.id,
      paymentIntentId: paymentIntent.id,
      user: updatedUser,
      paymentDetails,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res
      .status(500)
      .json({ error: 'Failed to process payment', message: error.message });
  }
};

//Refund Meathod
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
