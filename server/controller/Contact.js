import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer';
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Replace with your Gmail password or app password
  },
});

// Save form data and send email
export const submitContactForm = async (req, res) => {
  const { name, studentId, email, department, subject, message } = req.body;

  try {
    // Save to database
    const newContact = new Contact({ name, studentId, email, department, subject, message });
    await newContact.save();

    // Send email
    const mailOptions = {
      from: 'rahuljadhav7057461164@gmail.com',
      to: 'rahuljadhav7057461164@gmail.com',
      subject: `New Contact Form Query: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Student ID:</strong> ${studentId}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Form submitted successfully and email sent!' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'An error occurred while submitting the form.' });
  }
};
