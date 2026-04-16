import nodemailer from 'nodemailer';

// Create a transporter object
// By default, this uses Ethereal for testing if no environment variables are set.
const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Use provided SMTP credentials (e.g., Gmail, Brevo)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test account automatically for Ethereal
    console.log('No SMTP credentials found in environment. Generating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  const transporter = await createTransporter();
  
  const fromAddress = process.env.SMTP_FROM || '"Test App" <no-reply@test.com>';

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text: text || "Default missing text", // plain text body
    html: html || undefined, // html body
  });

  console.log("Message sent: %s", info.messageId);
  
  // If we are using Ethereal, we can log the preview URL
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("Preview URL: %s", previewUrl);
  }

  return { messageId: info.messageId, previewUrl };
};
