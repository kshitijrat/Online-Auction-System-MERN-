// contact.controller.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail use kar rahe ho
  auth: {
    user: process.env.EMAIL_USER,      //  email
    pass: process.env.EMAIL_PASS,      // app password 
  },
});

// Test connection once
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Nodemailer transporter is ready");
  }
});

export const handleSendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log("Contact form data:", { name, email, subject, message });

    // Admin ko email
    const adminMailOptions = {
      from: `"${name}" <${email}>`,
      to: "kshitijratnawat@gmail.com",
      replyTo: email,
      subject: `New message from ${name}: ${subject}`,
      html: adminEmailTemplate(name, email, subject, message),
    };

    const userMailOptions = {
      from: `"Kshitij Ratnawat" <kshitijratnawat@gmail.com>`,
      to: email,
      subject: "We received your message",
      html: userEmailTemplate(name, email, subject, message),
    };

    // Send emails
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log("Admin email sent:", adminInfo.response);

    const userInfo = await transporter.sendMail(userMailOptions);
    console.log("User confirmation email sent:", userInfo.response);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Something went wrong from server" });
  }
};

// HTML template for user
const userEmailTemplate = (name, email, subject, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Contact Confirmation</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f2f4f6; margin:0; padding:20px; color:#333; }
      .container { max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
      .footer { font-size:12px; color:#888; text-align:center; margin-top:30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for contacting us. We’ve received your message and our team will get back to you shortly. Here's a copy of what you submitted:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p>If this wasn’t you or you need immediate help, feel free to reply directly to this email.</p>
      <div class="footer">&copy; 2025 Online Auction (Kshitij Ratnawat). All rights reserved.</div>
    </div>
  </body>
  </html>
`;

// HTML template for admin
const adminEmailTemplate = (name, email, subject, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>New Contact Message</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f2f4f6; margin:0; padding:20px; color:#333; }
      .container { max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
    </style>
  </head>
  <body>
    <div class="container">
      <p>New Contact Form Submission from Online Auction</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  </body>
  </html>
`;
