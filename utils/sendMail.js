const nodeMailer = require("nodemailer");
const { Transpoter } = nodeMailer;
import ejs from "ejs";
import path from "path";
require("dotenv").config();

const sendMail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../emailTemplate", template);
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions)
};

module.exports=sendMail;