


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
export const sendOtpEmail = async (email: string, otp: string, code: string) => {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Your OTP Code',
            html: `
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
                <h2 style="color:#007BFF;">Your OTP Code</h2>
                <p>Hello,</p>
                <p>Your OTP for <strong>${code}</strong> is:</p>
                <p style="font-size:24px; font-weight:bold; color:#007BFF;">${otp}</p>
                <p>Use this code to complete your login. It expires in 10 minutes.</p>
                <p style="margin-top:20px; font-size:12px; color:#888;">BudgetTravels4U Team</p>
            </div>`
        });
        console.log('✅ OTP email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send OTP email:', err);
    }
};



export const sentTransactionalMail = async (bookingId: string, email: string) => {
    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Flight Booking Reference',
            html: `
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
                <h2 style="color:#007BFF;">Booking Reference</h2>
                <p>Thank you for choosing BudgetTravels4U!</p>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p>If you have questions, contact us:</p>
                <p>Email: contact@budgettravels4u.com | Phone: +1-551-362-8471</p>
                <p style="margin-top:20px; font-size:12px; color:#888;">BudgetTravels4U Team | <a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
            </div>`
        });
        console.log('✅ Transactional email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send transactional email:', err);
    }
};


export const sendCarBookingMail = async (bookingId: string, email: string, selectedCar: any, searchCriteria: any) => {
    const pickupDate = new Date(searchCriteria.time);
    const formattedPickupDate = pickupDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedPickupTime = pickupDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [email],
            subject: 'Car Booking Reference',
            html: `
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
                <h2 style="color:#007BFF;">Car Booking Reference</h2>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Car:</strong> ${selectedCar.vehicle.description.split(",")[1] || selectedCar.vehicle.description}</p>
                <p><strong>Pickup:</strong> ${formattedPickupDate}, ${formattedPickupTime} (${searchCriteria.startLocationCode})</p>
                <p><strong>Dropoff:</strong> ${searchCriteria.endName}</p>
                <p><strong>Total Price:</strong> USD ${selectedCar.quotation.monetaryAmount}</p>
                <p style="margin-top:20px; font-size:12px; color:#888;">BudgetTravels4U Team | <a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
            </div>`
        });
        console.log('✅ Car booking email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send car booking email:', err);
    }
};



export const sendHotelBookingMail = async (bookingDetails: any) => {
    const { newBookingId, contactInfo, selectedOffer } = bookingDetails;
    const { hotelName, checkInDate, checkOutDate, price, room } = selectedOffer;

    const formattedCheckIn = new Date(checkInDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedCheckOut = new Date(checkOutDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    try {
        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: 'BudgetTravels4U <no-reply@confirmation.budgettravels4u.com>',
            to: [contactInfo.email],
            subject: `Hotel Booking Reference - ${hotelName}`,
            html: `
            <div style="font-family:Arial,sans-serif; max-width:600px; margin:20px auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
                <h2 style="color:#007BFF;">Hotel Booking Reference</h2>
                <p><strong>Booking ID:</strong> ${newBookingId}</p>
                <p><strong>Hotel:</strong> ${hotelName}</p>
                <p><strong>Room:</strong> ${room.typeEstimated.category} (${room.description.text})</p>
                <p><strong>Check-In:</strong> ${formattedCheckIn}</p>
                <p><strong>Check-Out:</strong> ${formattedCheckOut}</p>
                <p><strong>Total Price:</strong> USD ${price.total}</p>
                <p>Contact: ${contactInfo.email} | ${contactInfo.phone}</p>
                <p style="margin-top:20px; font-size:12px; color:#888;">BudgetTravels4U Team | <a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
            </div>`
        });
        console.log('✅ Hotel booking email sent:', data);
    } catch (err) {
        console.error('❌ Failed to send hotel booking email:', err);
    }
};
