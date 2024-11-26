const nodemailer = require('nodemailer');
const { logger: logger } = require('../middlewares/logger');

const sendEmail = (email, uniqueString) => {
    var Transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'sakne.connect@gmail.com',
            pass: 'qdsv exml vayn fmap',
        },
    });

    var mailOptions;
    let sender = '"Bumasel" <sakne.connect@gmail.com';
    mailOptions = {
        from: sender,
        to: email,
        subject: 'Email confirmation',
        text: 'Hello there',
        html: ` 
      <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Verify your email address</h2>
          <p>Thank you and welcome to Bumasel platform</p>
          <p>To begin, activate your account by clicking <a href=http://13.60.215.117:5050/api/v1/auth/verifyemail?uniqueString=${uniqueString}&email=${email}  style="color: #0000ff; text-decoration: none;"> here </a> to verify your email</p>
          <div style=" margin-top: 60px;">
              <p>If you did not create an account, no further action is required.</p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Bumasel</b> Team</p>
          </div>
      </div>
      <div style="text-align: center; margin-top:50px">
          <h3><a href="https://root.com" style="color: black; text-decoration: none; margin-bottom: 0;">Bumasel.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Bumasel</p>
      </div>
  </div>
        `,
    };

    Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            logger.info('message sent');
        }
    });
};

const sendEmailOtp = (email, uniqueString) => {
    var Transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'sakne.connect@gmail.com',
            pass: 'qdsv exml vayn fmap',
        },
    });

    var mailOptions;
    let sender = '"Bumasel" <sakne.connect@gmail.com';
    mailOptions = {
        from: sender,
        to: email,
        subject: 'Email confirmation',
        text: 'Hello there',
        html: ` 
   <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Verify your email address</h2>
          <p>Use the code below to verify your email</p>
          <h1>${uniqueString}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withBumasel.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Bumasel</b> Team</p>
          </div>
      </div>
    <div style="text-align: center; margin-top:50px">
          <h3><a href="https://root.com" style="color: black; text-decoration: none; margin-bottom: 0;">Bumasel.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Bumasel</p>
      </div>
    </div>
        `,
    };

    Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            logger.info('message sent');
        }
    });
};

const sendPasswordResetEmail = (email, uniqueString) => {
    var Transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'sakne.connect@gmail.com',
            pass: 'qdsv exml vayn fmap',
        },
    });

    var mailOptions;
    let sender = '"Bumasel" <sakne.connect@gmail.com';
    mailOptions = {
        from: sender,
        to: email,
        subject: 'Change Bumasel password',
        text: 'Hello there',
        html: `
      <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Reset password</h2>
          <p>Use the code below to reset your password</p>
          <h1>${uniqueString}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withBumasel.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Bumasel</b> Team</p>
          </div>
      </div>
      <div style="text-align: center; margin-top:50px">
          <h3><a href="https://withBumasel.com" style="color: #ffcc00; text-decoration: none; margin-bottom: 0;">Bumasel.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Bumasel Africa Technologies</p>
      </div>
    </div>
      `,
    };

    Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            logger.log(error);
        } else {
            logger.log('message sent');
        }
    });
};

module.exports = {
    sendEmail,
    sendEmailOtp,
    sendPasswordResetEmail,
};
