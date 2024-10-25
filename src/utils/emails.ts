import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net', // GoDaddy SMTP server
    port: 587, // Use 465 for secure (SSL) or 587 for TLS
    secure: false, // Set to true if using port 465
    auth: {
        user: 'support@universalticketss.com', // Replace with your GoDaddy email
        pass: 'odn$3875G', // Replace with your email password
    },
    tls: {
        rejectUnauthorized: false, // Disable this only if you're having issues with certificates
    },
});





export const sendOtpEmail = async (email: string, otp: string, code: string) => {
    const mailOptions = {
        from: 'support@universalticketss.com', // Sender address
        to: email, // List of recipients
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`, // Plain text body
        html: `
        <!DOCTYPE html>
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
            <p><a href="https://universalticketss.com" style="color: #007BFF;">Visit our website</a></p>
        </div>
    </div>
</body>
</html>

        `, // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send OTP email');
    }
};


export const sentTransactionaMail = async (email: string, otp: string, code: string) => {
    const mailOptions = {
        from: 'support@universalticketss.com', // Sender address
        to: email, // List of recipients
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`, // Plain text body
        html: `
        <!DOCTYPE html>
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
                            <p>Dear User,</p>
                            <p>Thank you for using Universal Tickets! Your One-Time Password (OTP) code is:</p>
                            <p class="otp">${otp}</p>
                            <p>Please use this code to complete your transaction.</p>
                            <p>If you did not request this code, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>Best regards,</p>
                            <p>The Universal Tickets Team</p>
                            <p><a href="https://universalticketss.com" style="color: #007BFF;">Visit our website</a></p>
                        </div>
                    </div>
                </body>
                </html>

        `, // HTML body
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send OTP email');
    }
};
