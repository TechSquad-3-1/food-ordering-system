import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',  // This specifies Gmail as the SMTP service.
  auth: {
    user: "h1runichamathka230@gmail.com",   // Your Gmail address (ensure this is correct)
    pass: "gqvp yeqi vpdn gqii",   // Your App Password (ensure this is correct)
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email address
    to ,  // Recipient's email address
    subject,  // Subject of the email
    text,  // Body content of the email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Rethrow the error for further handling
  }
};
