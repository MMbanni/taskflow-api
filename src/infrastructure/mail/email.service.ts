import nodemailer from 'nodemailer';
import { config } from '../../config/config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailUser,
    pass: config.mailAppPass
  }

});

export async function welcomeMessage(username: string, email: string): Promise<boolean> {
  const subject = 'Welcome to TaskFlow';
  const message = `Hello ${username},\nThank you for signing up for TaskFlow`;
  return sendMessage(email, subject, message);
}

export async function sendResetPasswordMessage(email: string, code: string): Promise<boolean> {
  return sendMessage(email, 'Password reset', `Hello, \n Your password reset code is ${code}`);

}

async function sendMessage(receiver: string, subject: string, message: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: config.mailUser,
      to: receiver,
      subject: subject,
      text: message
    });
    return true;
  } catch (err) {
    console.error('Failed to send email', err);
    return false;    
  }
}

