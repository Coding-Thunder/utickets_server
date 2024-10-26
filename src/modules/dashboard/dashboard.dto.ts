export class DashboardDataDto {
    totalEmployees: number;  // totalEmployees -> employeeCount
    totalBookings: number;     // adminsCount -> adminCount
    adminsCount: number;    // viewerCount remains the same
    viewerCount: number;  // totalBookings -> bookingsCount
    pendingBookings: number
    completedBookings: number
}
