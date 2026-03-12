const nodemailer = require("nodemailer");

const from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = { transporter, from };


//const Email = require('email-templates');
// const nodemailer = require('nodemailer');
// const from='no-reply@lokakeralamonline.kerala.gov.in'


// const transporter = nodemailer.createTransport({
//     host: "email-smtp.ap-south-1.amazonaws.com",
//     port: 465,
//     secure: true, // Use true for port 465, false for all other ports
//     auth: {
//       user: "AKIAVRUVRT6OC7KAMA7B",
//       pass: "BA+cO0EF59kUrlHIgK1YuuI4cwmXgAe+bk58+dprQmEQ",
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });

// module.exports={transporter,from}