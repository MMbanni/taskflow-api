const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASS
  }

});

async function welcomeMessage(username, email) {
  const subject = 'Welcome to TaskFlow';
  const message = `Hello ${username},\nThank you for signing up for TaskFlow`;
  await sendMessage(email, subject, message);
}

async function resetPasswordMessage(email, code) {
  sendMessage(email, 'Password rest', `Hello, \n Your password reset code is ${code}`);
  return;
}

async function sendMessage(receiver, subject, message) {
  transporter.sendMail({
    from: process.env.USER,
    to: receiver,
    subject: subject,
    text: message
  });
}

module.exports = {
  sendMessage,
  resetPasswordMessage,
  welcomeMessage
}
