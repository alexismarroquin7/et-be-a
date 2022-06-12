const nodemailer = require('nodemailer');

const sendMail = async (transporterOptions, mailOptions) => {
  const transporter = nodemailer.createTransport(transporterOptions);
  const info = await transporter.sendMail(mailOptions);
  return info;
};

const sendRegisterEmail = async ({
  to = ''
}) => {
  await sendMail(
    {
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS
      }
    },
    {
      from: process.env.NODEMAILER_AUTH_USER,
      to,
      subject: '[Expense Tracker - Confirm Email]',
      // text: `confirm email at the following link ${process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_CLIENT_URL : process.env.REACT_APP_PRODUCTION_CLIENT_URL}/auth/sign-up?token=${token}`
      text: `hello`
    }
  );

  return 'email sent!'
}

module.exports = {
  sendMail,
  sendRegisterEmail
};