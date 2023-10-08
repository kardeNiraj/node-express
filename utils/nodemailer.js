// 'use strict';
const nodemailer = require('nodemailer');

module.exports.mail = async function mail(str, data) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'neeraj.karde01@gmail.com',
        pass: 'fbpgdnrqjeljakev',
      },
    });

    let Subject, Html, Text;
    if (str == 'signup') {
      Subject = `Thank you for choosing us ${data.name}`;
      Html = `
    <h1>Welcome to my backend project</h1>
    Forwaard this mail or you will fail this semester..
    😉
    <br>
    Anywho, these are your details:
    <br>
    name: ${data.name}
    <br>
    email: ${data.email}
    `;
      Text = '';
    } else if (str == 'resetPassword') {
      Subject = `Reset Password`;
      Html = `
    <h1>Dumbo remember your password from now on</h1>
    You have no idea how hard it is to reset a password. 🥲
    <br>
    here is a link to reset your password: ${data.resetPasswordLink}
    `;
      Text = 'use the provided link to reset your password';
    }

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Backend" <neeraj.karde01@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: Subject, // Subject line
      text: Text, // plain text body
      html: Html, // html body
    });

    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.log(err);
  }
};
