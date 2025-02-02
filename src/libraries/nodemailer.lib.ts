import nodemailer from 'nodemailer';
import { logger } from '@utilities';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// SVG is not supported in many email clients
// ! Weird interaction with webpack
// const resetPasswordHTML = fs.readFileSync(
//   path.join(__dirname, '../../public/resetPassword.template.html'),
//   'utf8'
// );
const sendMail = async function (to: string, subject: any): Promise<void> {
  try {
    await transporter.sendMail({
      from: `Bygram <${process.env.EMAIL_USER}>`,
      to,
      subject,
      // html: resetPasswordHTML,
      attachments: [
        {
          path: __dirname + '/logo.png',
          cid: 'logo',
        },
      ],
    });
  } catch (error) {
    logger.error(`${error}`, 'Nodemailer');
    return Promise.reject(error);
  }
};

export default { sendMail };
