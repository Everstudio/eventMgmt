import nodemailer from "nodemailer";
import { notificationEmailTemplate } from "./emailTemplate.mjs";
import pool from "../configs/db.mjs";
import fs from "fs";

//define email configuration
const emailConfig = {
  host: "mail.8verstudio.com",
  port: 465,
  secure: true,
  auth: {
    user: "no-reply@8verstudio.com",
    pass: "Tempnoreply1234++",
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
};

let instance = null;

class NotificationDelivery {
  constructor() {
    if (!instance) {
      this.transporter = nodemailer.createTransport(emailConfig);
      instance = this; //store the instance in the variable
    }

    return instance; //singleton instance
  }

  //email service
  // Send email notifications in bulk
  async sendEmailNotification(emailNotifications) {
    const filePath = emailNotifications.path;
    console.log("File path:", filePath);
    const fileName = filePath.split("/").pop();

    try {
      // Send email using the pooled transporter
      const mailOptions = {
        from: "No Reply <no-reply@8verstudio.com>",
        to: emailNotifications.emailTo,
        subject: emailNotifications.title,
        html: notificationEmailTemplate(),
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      };

      // Send email
      const resultSend = await this.transporter.sendMail(mailOptions);
      console.log("Email send result:", resultSend);

      return true;
    } catch (error) {
      console.error("Error sending bulk email notifications:", error);
      return false;
    }
  }
}

export default NotificationDelivery;
