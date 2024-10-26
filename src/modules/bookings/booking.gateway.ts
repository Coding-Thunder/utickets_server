// src/modules/bookings/booking.gateway.ts

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Booking } from 'src/schemas/bookings.schema';

@WebSocketGateway()
export class BookingGateway {
    @WebSocketServer()
    server: Server;

    notifyNewBooking(booking: Booking) {
        this.server.emit('newBooking', booking);
    }
}
