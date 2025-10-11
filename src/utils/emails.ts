import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true,
    auth: {
        user: 'reservation@budgettravels4u.com',
        pass: 'odn$3875G',
    },
});

transporter.verify((err, success) => {
  if (err) console.error('SMTP verify failed:', err);
  else console.log('SMTP server ready to send');
});


export const sendOtpEmail = async (email: string, otp: string, code: string) => {
    const mailOptions = {
        from: 'OTP <support@budgettravels4u.com>', // Sender address
        to: email, // List of recipients
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`, // Plain text body
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007BFF;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background-color: #f4f4f4;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            font-size: 12px;
            color: #888888;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your OTP Code</h1>
        </div>
        <div class="content">
            <p>Dear Employee,</p>
            <p>Thank you for being a valued member of Universal Tickets! Your One-Time Password (OTP) code for employee <strong>${code}</strong> is:</p>
            <p class="otp">${otp}</p>
            <p>Please use this code to complete your login.</p>
            <p>If you did not request this code, please ignore this email or contact support.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>The Universal Tickets Team</p>
            <p><a href="https://budgettravels4u.com" style="color: #007BFF;">Visit our website</a></p>
        </div>
    </div>
</body>
</html>` // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // // console.log(error)
        throw new Error('Failed to send OTP email');
    }
};


export const sentTransactionalMail = async (bookingId: string, email: string) => {
    const mailOptions = {
        from: 'support@budgettravels4u.com', // Sender name and address
        to: email, // Recipient's email address
        subject: 'Booking Successful - Universal Ticketss',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #007BFF;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    background-color: #f4f4f4;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    font-size: 12px;
                    color: #888888;
                }
                .booking-id {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007BFF;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Confirmed</h1>
                </div>
                <div class="content">
                    <p>Dear Customer,</p>
                    <p>Thank you for choosing Universal Tickets! Your booking ID is:</p>
                    <p class="booking-id">${bookingId}</p>
                    <p>If you need further assistance, feel free to contact us at:</p>
                    <p>Email: contact@budgettravels4u.com</p>
                    <p>Phone: +18609464369</p>
                    <p>Safe travels!</p>
                </div>
                <div class="footer">
                    <p>Best regards,</p>
                    <p>The Universal Tickets Team</p>
                    <p><a href="https://budgettravels4u.com" style="color: #007BFF;">Visit our website</a></p>
                </div>
            </div>
        </body>
        </html>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // // console.log(error)
        // // console.log(error)
    }
};
export const sendCarBookingMail = async (
    bookingId: string,
    email: string,
    selectedCar: any,
    searchCriteria: any
) => {
    const pickupDate = new Date(searchCriteria.time);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedPickupTime = pickupDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const mailOptions = {
        from: 'Universal Ticketss <support@budgettravels4u.com>',
        to: email,
        subject: 'Car Booking Successful - Universal Ticketss',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Car Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f4f4; }
    .container { width:100%; max-width:600px; margin:20px auto; background:#fff; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.1);}
    .header { background:#007BFF; color:#fff; padding:20px; text-align:center; border-radius:8px 8px 0 0;}
    .content { padding:20px; }
    .footer { text-align:center; padding:10px; background:#f4f4f4; border-radius:0 0 8px 8px; font-size:12px; color:#888;}
    .booking-id, .car-info { font-size:20px; font-weight:bold; color:#007BFF; margin:8px 0; }
    .details { margin:8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Car Booking Confirmed</h1></div>
    <div class="content">
      <p>Dear Customer,</p>
      <p>Your car booking ID is:</p>
      <p class="booking-id">${bookingId}</p>
      <p class="car-info">Car Details:</p>
      <div class="details">
        <p>${selectedCar.vehicle.description.includes(",") && selectedCar.vehicle.description.split(",")[1]}</p>
        <p>Pickup: ${formattedPickupDate}, ${formattedPickupTime} (${searchCriteria.startLocationCode})</p>
        <p>Dropoff: ${searchCriteria.endName}</p>
        <p>Total Price: USD ${selectedCar.quotation.monetaryAmount}</p>
      </div>
      <p>For any queries, contact us at:</p>
      <p>Email: contact@budgettravels4u.com</p>
      <p>Phone: +18609464369</p>
      <p>Safe travels!</p>
    </div>
    <div class="footer">
      <p>Best regards,</p>
      <p>The Universal Tickets Team</p>
      <p><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
    </div>
  </div>
</body>
</html>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // console.error('Failed to send car booking email:', error);
    }
};
