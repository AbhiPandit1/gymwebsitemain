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

    const logoURL =
      'https://res.cloudinary.com/diohupopk/image/upload/v1727989850/programPanda/xjaf4oowewoanfm6csqn.png'; // Replace with actual logo URL

    const mailOptions = {
      from: `ProgramPanda <${process.env.SMTP_FROM_EMAIL}>`, // Display name with email
      to: email,
      subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoURL}" alt="ProgramPanda Logo" style="max-width: 200px;"/>
          </div>
          <div>${message}</div>
          <p style="color: gray; font-size: 12px;">This email was sent by ProgramPanda.</p>
        </div>
      `,
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
