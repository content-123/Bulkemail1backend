
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://keerthana:adpUHGROqfvZmRqZ@cluster0.voqwj13.mongodb.net/bulkemail', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Email Schema and Model
const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
});

const Email = mongoose.model('Email', emailSchema);

// Express Route to Send Bulk Email
app.post('/send-bulk-email', async (req, res) => {
  try {
    const { to, subject,body } = req.body;


    // Save email to MongoDB (you might want to add more fields like sender, etc.)
    const newEmail = new Email({ to, subject, body });
    await newEmail.save();

    // Send email using Nodemailer (replace with your SMTP details)
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com', // Replace with your email service SMTP server
        port: 587, // Replace with your email service SMTP port
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'keerthanakk10@yahoo.com', // Replace with your email address
          pass: 'judrcezgubrirqcc', // Replace with your email password or app password
        },
          });

    const mailOptions = {
        from: 'keerthanakk10@yahoo.com', // Replace with your email address
        to, // Replace with the recipient's email address
        subject,
        html:body,
          };
    

    transporter.sendMail(mailOptions, (error,info) => {
      if (!error) {
      console.log('Email sent:', info.response);
        res.json({ message: 'Email sent successfully' });
      } else {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error' });;
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})