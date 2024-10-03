import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, message, emailType }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject,
      text: message,
      headers: {
        'X-Email-Type': emailType, // Custom header for email type
      },
    };

    // Log mail options to verify correct settings
    console.log('Mail Options:', mailOptions);

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
