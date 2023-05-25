const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
const { convert } = require('html-to-text');
const pug = require('pug');

// const catchAsync = require('./catchAsync.js');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `brrayancito <${process.env.EMAIL_FROM}>`;
  }

  transporter() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };

    // 3) Create a transport and send email
    await this.transporter().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
};

// const sendEmail = catchAsync(async (options) => {
//   //1) Create a transporter
//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST,
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD,
//   //   },
//   // });

//   //2) Define the email options
//   const mailOptions = {
//     from: 'brrayancito <javy@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   //3) Actually send the email
//   await transporter.sendMail(mailOptions);
// });

// module.exports = sendEmail;
