import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const MAILGUN_API_KEY = '';
const MAILGUN_DOMAIN = '';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  // url: 'https://api.eu.mailgun.net' // uncomment if EU domain
});

export const sendHotelBookingMail = async (bookingDetails) => {
  const { newBookingId } = bookingDetails;
  const { contactInfo, selectedOffer } = bookingDetails;
  const { hotelName, checkInDate, checkOutDate, price, room, policies } =
    selectedOffer;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const formattedCheckIn = checkIn.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedCheckOut = checkOut.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
${price.variations.changes.map((c) => `<li>${c.startDate} - ${c.endDate}: ${price.currency} ${c.base}</li>`).join('')}
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
<p>Phone: +18609464369</p>

<p style="font-size:12px; color:#888;">Best regards,<br/>The Budget Travels4U Team<br/><a href="https://budgettravels4u.com" style="color:#007BFF;">Visit our website</a></p>
</div>
</div>
</body>
</html>`,
    });

    console.log('✅ Hotel booking email sent:', data);
  } catch (err) {
    console.error('❌ Failed to send hotel booking email:', err);
  }
};

sendHotelBookingMail({
  newBookingId: '1234',
  contactInfo: {
    phone: '+919953109415',
    email: 'vinaymaheshwari35@gmail.com',
  },
  selectedOffer: {
    hotelId: 'RDDEL966',
    offerId: 'EXRP8Z910H',
    hotelName: 'RADISSON BLU HOTEL NOIDA',
    checkInDate: '2025-10-20',
    checkOutDate: '2025-10-30',
    price: {
      currency: 'INR',
      base: '260000.00',
      total: '306800.00',
      taxes: [
        {
          code: 'TOTAL_TAX',
          amount: '46800.00',
          currency: 'INR',
          included: false,
        },
      ],
      variations: {
        average: {
          base: '26000.00',
        },
        changes: [
          {
            startDate: '2025-10-20',
            endDate: '2025-10-26',
            base: '20000.00',
          },
          {
            startDate: '2025-10-26',
            endDate: '2025-10-30',
            base: '35000.00',
          },
        ],
      },
    },
    room: {
      type: 'PRE',
      typeEstimated: {
        category: 'PREMIUM_ROOM',
      },
      description: {
        text: 'Best Available Rate\nPrive Premium Room',
        lang: 'EN',
      },
    },
    policies: {
      cancellations: [
        {
          deadline: '2025-10-19T18:00:00+05:30',
          amount: '20000.00',
          policyType: 'CANCELLATION',
        },
      ],
      guarantee: {
        acceptedPayments: {
          creditCards: ['AX', 'CU', 'DC', 'JC', 'MA', 'CA', 'VI'],
          methods: ['CREDIT_CARD', 'VCC_EXTERNAL_PROVIDER'],
          creditCardPolicies: [
            {
              vendorCode: 'AX',
            },
            {
              vendorCode: 'CU',
            },
            {
              vendorCode: 'DC',
            },
            {
              vendorCode: 'JC',
            },
            {
              vendorCode: 'MA',
            },
            {
              vendorCode: 'CA',
            },
            {
              vendorCode: 'VI',
            },
          ],
        },
      },
      paymentType: 'guarantee',
      refundable: {
        cancellationRefund: 'REFUNDABLE_UP_TO_DEADLINE',
      },
    },
  },
  cardInfo: {
    number: '6075322022116177',
    month: '05',
    year: '2026',
    cvc: '175',
    name: 'Ganesh Ojha',
  },
  billingInfo: {
    country: 'Austria',
    address: 'Kaushik enclave Burari nala paar gali no37 block b',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110084',
  },
});
