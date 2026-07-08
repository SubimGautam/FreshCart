const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @route   POST /api/contact
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to database
    const contact = await Contact.create({ name, email, subject, message });

    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"FreshCart Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Contact Form: ${subject}`,
        html: `
          <h3>New message from ${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    next(error);
  }
};

// Optional: Admin can view all messages (add route if needed)
const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactForm, getAllMessages };