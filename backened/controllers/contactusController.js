import nodemailer from 'nodemailer'


export const contactusController = async (req, res) => {
    const { name, email, phone, address, message } = req.body;
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: 'zdgf sztu ysrg xvqm',
      },
    });

    const mailOptions = {
      from: process.env.MY_EMAIL ,
      to: process.env.SHOP_EMAIL, // Replace with the shop owner's Gmail address
      subject: 'Contact Us Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Address: ${address}
        Message: ${message}
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error in sending email');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
      }
    })
}
  