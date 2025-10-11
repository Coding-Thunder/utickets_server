import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465, // try 587 if this one fails
  secure: true, // use false if you switch to 587
  auth: {
    user: 'reservation@budgettravels4u.com',
    pass: 'odn$3875G',
  },
});

(async () => {
  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: 'Budget Travels <reservation@budgettravels4u.com>',
      to: 'vinaymaheshwari35@gmail.com', // <-- put your real email here
      subject: 'SMTP Test - BudgetTravels4U',
      text: 'If you get this email, GoDaddy SMTP is working!',
    });

    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Email send failed:', err);
  }
})();
