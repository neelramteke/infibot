
import { createClient } from '@supabase/supabase-js';
import { UserInfo, Event, Ticket } from '@/lib/types';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  try {
    // Simulate API call to avoid actual Supabase dependency for now
    return Promise.resolve([
      {
        id: '1',
        name: 'Tech Conference',
        description: 'A major tech conference featuring the latest innovations',
        date: '2023-12-10',
        time: '09:00 AM',
        venue: 'Convention Center',
        city: 'Mumbai',
        price: '₹2500',
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80'
      },
      {
        id: '2',
        name: 'Music Festival',
        description: 'Annual music festival with top artists',
        date: '2023-12-15',
        time: '04:00 PM',
        venue: 'Stadium',
        city: 'Delhi',
        price: '₹3000',
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80'
      },
      {
        id: '3',
        name: 'Comedy Night',
        description: 'A night of laughter with the best comedians',
        date: '2023-12-20',
        time: '08:00 PM',
        venue: 'Theater',
        city: 'Bangalore',
        price: '₹1500',
        category: 'Comedy',
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80'
      },
      {
        id: '4',
        name: 'Food Festival',
        description: 'Explore cuisines from around the world',
        date: '2023-12-25',
        time: '11:00 AM',
        venue: 'Exhibition Center',
        city: 'Chennai',
        price: '₹1000',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2437&q=80'
      }
    ]);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get events by city
export const getEventsByCity = async (city: string): Promise<Event[]> => {
  try {
    const events = await getEvents();
    return events.filter(event => event.city.toLowerCase() === city.toLowerCase());
  } catch (error) {
    console.error('Error fetching events by city:', error);
    throw error;
  }
};

// Get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const events = await getEvents();
    return events.filter(event => event.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw error;
  }
};

// Save user information
export const saveUserInfo = async (userInfo: UserInfo): Promise<string> => {
  try {
    // In a real app, you would insert the user info into Supabase
    // For now, return a mock user ID
    return Promise.resolve(`user-${Math.random().toString(36).substring(2, 10)}`);
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
};

// Book an event (create a ticket)
export const saveBooking = async (
  eventId: string, 
  userId: string, 
  ticketPdf?: string, 
  qrCode?: string
): Promise<string> => {
  try {
    // In a real app, you would insert the booking into Supabase
    // For now, simulate a successful booking
    const event = (await getEvents()).find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Store ticket in local storage for demo purposes
    const bookingId = `booking-${Math.random().toString(36).substring(2, 10)}`;
    console.log('Saving booking with ID:', bookingId);
    
    return bookingId;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

// Get ticket details
export const getTicketDetails = async (ticketId: string): Promise<Ticket | null> => {
  try {
    // In a real app, you would fetch the ticket from Supabase
    // For now, return a mock ticket
    return {
      id: ticketId,
      eventId: 'event-id',
      userId: 'user-id',
      bookingDate: new Date(),
      qrCode: 'mock-qr-code',
      quantity: 1,
      totalAmount: '₹2500'
    };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
};

// Get user bookings (placeholder implementation)
export const getUserBookings = async (userId: string) => {
  try {
    // In a real app, you would query Supabase
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Generate ticket PDF
export const generateTicketPDF = async (
  eventName: string,
  userName: string,
  eventDate: string,
  qrCodeUrl: string,
  quantity: number,
  totalAmount: string
): Promise<string> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set background color
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add event info
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text(`Ticket: ${eventName}`, 15, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Date: ${eventDate}`, 15, 35);
    doc.text(`Quantity: ${quantity}`, 15, 42);
    doc.text(`Total Price: ${totalAmount}`, 15, 49);
    
    // Add user info
    doc.text(`Name: ${userName}`, 15, 63);
    
    // Add QR code
    doc.addImage(qrCodeUrl, 'PNG', 65, 80, 80, 80);
    doc.text('Scan this QR code at the venue', 70, 170);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('This e-ticket must be presented at the venue', 15, 200);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 15, 207);
    
    // Convert to base64 string
    const pdfData = doc.output('datauristring');
    return pdfData;
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    toast.error('Failed to generate ticket PDF');
    // Return a fallback PDF
    return '';
  }
};
