//import sendgrid
import nodemailer from 'nodemailer';
import sendGridMail from '@sendgrid/mail';
import Mail from 'nodemailer/lib/mailer';
import { config } from '@root/config';
import logger from '@root/logger';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body);
    } else {
      this.productionEmailSender(receiverEmail, subject, body);
    }
  }

  private async developmentEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      // secure: true,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const mailOptions: IMailOptions = {
      from: `Chatty Application ${config.SENDER_EMAIL}`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Development email sent successfully');
    } catch (error) {
      logger.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }

  private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `Chatty Application ${config.SENDER_EMAIL}`,
      to: receiverEmail,
      subject,
      html: body,
    };

    try {
      await sendGridMail.send(mailOptions);
      logger.info('Production email sent successfully');
    } catch (error) {
      logger.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport = new MailTransport();
