


import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const MAILGUN_API_KEY = '';
const MAILGUN_DOMAIN = "";


const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY,
    // url: 'https://api.eu.mailgun.net' // uncomment if EU domain
});

// ---------------- OTP EMAIL ----------------
export const sendOtpEmail = async (email: string, otp: string, code: string) => {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Your OTP Code</title>
<style>
body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0;}
.container { max-width:600px; margin:20px auto; background:#fff; border-radius:8px; padding:20px;}
.header { background:#007BFF; color:#fff; padding:20px; text-align:center; border-radius:8px 8px 0 0;}
.content { padding:20px; }
.footer { text-align:center; padding:10px; background:#f4f4f4; font-size:12px; color:#888; border-radius:0 0 8px 8px;}
.otp { font-size:24px; font-weight:bold; color:#007BFF; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>Your OTP Code</h1></div>
<div class="content">
<p>Dear Employee,</p>
<p>Your OTP code for employee <strong>${code}</strong> is:</p>
<p class="otp">${otp}</p>
<p>Please use this code to complete your login.</p>
</div>
<div class="footer">
<p>Best regards,<br/>The Budget Travels4U Team</p>
<p><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
</div>
</div>
</body>
</html>`
        });
        console.log('✅ OTP email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send OTP email:', err);
    }
};

// ---------------- TRANSACTIONAL BOOKING EMAIL ----------------
export const sentTransactionalMail = async (bookingId: string, email: string) => {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Booking Successful - Budget Travels4U',
            html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Booking Confirmation</title></head>
<body>
<div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
<div style="max-width:600px; margin:0 auto; background:#fff; border-radius:8px; padding:20px;">
<h1 style="background:#007BFF; color:#fff; padding:20px; border-radius:8px 8px 0 0;">Booking Confirmed</h1>
<p>Dear Customer,</p>
<p>Thank you for choosing Budget Travels4U! Your booking ID is:</p>
<p style="font-size:24px; font-weight:bold; color:#007BFF;">${bookingId}</p>
<p>If you need further assistance, contact us at:</p>
<p>Email: contact@budgettravels4u.com</p>
<p>Phone: +1-551-362-8471</p>
<p>Safe travels!</p>
<p style="font-size:12px; color:#888;">Best regards,<br/>The Budget Travels4U Team<br/><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
</div>
</div>
</body>
</html>`
        });
        console.log('✅ Transactional email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send transactional email:', err);
    }
};

// ---------------- CAR BOOKING EMAIL ----------------
export const sendCarBookingMail = async (
    bookingId: string,
    email: string,
    selectedCar: any,
    searchCriteria: any
) => {
    const pickupDate = new Date(searchCriteria.time);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedPickupTime = pickupDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Car Booking Successful - Budget Travels4Us',
            html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Car Booking Confirmation</title></head>
<body>
<div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
<div style="max-width:600px; margin:20px auto; background:#fff; border-radius:8px; padding:20px;">
<h1 style="background:#007BFF; color:#fff; padding:20px; border-radius:8px 8px 0 0;">Car Booking Confirmed</h1>
<p>Dear Customer,</p>
<p>Your car booking ID is:</p>
<p style="font-size:20px; font-weight:bold; color:#007BFF;">${bookingId}</p>
<p>Car Details:</p>
<div>
<p>${selectedCar.vehicle.description.includes(",") ? selectedCar.vehicle.description.split(",")[1] : selectedCar.vehicle.description}</p>
<p>Pickup: ${formattedPickupDate}, ${formattedPickupTime} (${searchCriteria.startLocationCode})</p>
<p>Dropoff: ${searchCriteria.endName}</p>
<p>Total Price: USD ${selectedCar.quotation.monetaryAmount}</p>
</div>
<p>For any queries, contact us at:</p>
<p>Email: contact@budgettravels4u.com</p>
<p>Phone: +1-551-362-8471</p>
<p>Safe travels!</p>
<p style="font-size:12px; color:#888;">Best regards,<br/>The Budget Travels4U Team<br/><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
</div>
</div>
</body>
</html>`
        });
        console.log('✅ Car booking email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send car booking email:', err);
    }
};




// -// ---------------- HOTEL BOOKING EMAIL ----------------
export const sendHotelBookingMail = async (
    bookingDetails: any
) => {
    const { newBookingId } = bookingDetails;
    const { contactInfo, selectedOffer } = bookingDetails;
    const { hotelName, checkInDate, checkOutDate, price, room, policies } = selectedOffer;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const formattedCheckIn = checkIn.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedCheckOut = checkOut.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [contactInfo.email],
            subject: `Hotel Booking Confirmed - ${hotelName}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Hotel Booking Confirmation</title></head>
<body>
<div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
<div style="max-width:600px; margin:20px auto; background:#fff; border-radius:8px; padding:20px;">
<h1 style="background:#007BFF; color:#fff; padding:20px; border-radius:8px 8px 0 0;">Hotel Booking Confirmed</h1>

<p>Dear Customer,</p>
<p>Your hotel booking ID is:</p>
<p style="font-size:20px; font-weight:bold; color:#007BFF;">${newBookingId}</p>

<h2>Hotel Details</h2>
<p><strong>${hotelName}</strong></p>
<p>Room Type: ${room.typeEstimated.category} (${room.description.text})</p>
<p>Check-In: ${formattedCheckIn}</p>
<p>Check-Out: ${formattedCheckOut}</p>
<p>Total Price: ${price.currency} ${price.total}</p>

<h3>Price Breakdown</h3>
<ul>
${price.variations.changes.map(c => `<li>${c.startDate} - ${c.endDate}: ${price.currency} ${c.base}</li>`).join('')}
<li>Taxes: ${price.currency} ${price.taxes.reduce((acc, t) => acc + parseFloat(t.amount), 0)}</li>
</ul>

<h3>Cancellation Policy</h3>
<p>Deadline: ${new Date(policies.cancellations[0].deadline).toLocaleString('en-US')}</p>
<p>Amount: ${price.currency} ${policies.cancellations[0].amount}</p>

<h3>Guest Contact</h3>
<p>Email: ${contactInfo.email}</p>
<p>Phone: ${contactInfo.phone}</p>

<p>For any queries, contact us at:</p>
<p>Email: contact@budgettravels4u.com</p>
<p>Phone: +1-551-362-8471</p>

<p style="font-size:12px; color:#888;">Best regards,<br/>The Budget Travels4U Team<br/><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
</div>
</div>
</body>
</html>`
        });

        console.log('✅ Hotel booking email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send hotel booking email:', err);
    }
};
