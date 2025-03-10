
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
        location: 'Mumbai',
        price: 2500,
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80'
      },
      {
        id: '2',
        name: 'Music Festival',
        description: 'Annual music festival with top artists',
        date: '2023-12-15',
        time: '04:00 PM',
        location: 'Delhi',
        price: 3000,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80'
      },
      {
        id: '3',
        name: 'Comedy Night',
        description: 'A night of laughter with the best comedians',
        date: '2023-12-20',
        time: '08:00 PM',
        location: 'Bangalore',
        price: 1500,
        category: 'Comedy',
        image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2371&q=80'
      },
      {
        id: '4',
        name: 'Food Festival',
        description: 'Explore cuisines from around the world',
        date: '2023-12-25',
        time: '11:00 AM',
        location: 'Chennai',
        price: 1000,
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
    return events.filter(event => event.location.toLowerCase() === city.toLowerCase());
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

// Book an event (create a ticket)
export const saveBooking = async (eventId: string, userInfo: UserInfo, quantity = 1): Promise<Ticket> => {
  try {
    // In a real app, you would insert the booking into Supabase
    // For now, simulate a successful booking
    const event = (await getEvents()).find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Generate mock ticket data
    const ticket = {
      id: Math.random().toString(36).substring(2, 10),
      eventId,
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      user: userInfo,
      quantity,
      totalPrice: event.price * quantity,
      bookingDate: new Date().toISOString(),
    };

    // Generate PDF ticket (mock)
    const pdfData = await generateTicketPDF(ticket);
    
    // Store ticket in local storage for demo purposes
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    localStorage.setItem('tickets', JSON.stringify([...existingTickets, ticket]));
    
    return { ...ticket, pdfUrl: pdfData };
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

// Get user bookings
export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, events(*), users(*)')
      .eq('user_id', userId);

    if (error) throw error;
    
    // Extract user data from the nested structure with proper type safety
    const userData = data.users as { name?: string; email?: string } || {};
    
    return {
      ticketId: data.id,
      eventId: data.event_id,
      eventName: data.events?.name || '',
      eventDate: data.events?.date || '',
      eventTime: data.events?.time || '',
      eventLocation: data.events?.location || '',
      user: {
        name: userData.name || '',
        email: userData.email || '',
      },
      quantity: data.quantity || 1,
      totalPrice: data.total_price || 0,
      bookingDate: data.created_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Generate ticket PDF
const generateTicketPDF = async (ticket: Ticket): Promise<string> => {
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
    doc.text(`Ticket: ${ticket.eventName}`, 15, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Date: ${ticket.eventDate}`, 15, 35);
    doc.text(`Time: ${ticket.eventTime}`, 15, 42);
    doc.text(`Location: ${ticket.eventLocation}`, 15, 49);
    doc.text(`Quantity: ${ticket.quantity}`, 15, 56);
    doc.text(`Total Price: ₹${ticket.totalPrice}`, 15, 63);
    
    // Add user info
    doc.text(`Name: ${ticket.user.name}`, 15, 77);
    doc.text(`Email: ${ticket.user.email}`, 15, 84);
    
    // Generate QR code
    try {
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify({
        ticketId: ticket.id,
        eventId: ticket.eventId,
        userName: ticket.user.name,
        date: ticket.eventDate,
        time: ticket.eventTime,
      }));
      
      doc.addImage(qrCodeDataURL, 'PNG', 65, 100, 80, 80);
      doc.text('Scan this QR code at the venue', 70, 190);
    } catch (error) {
      console.error('Error generating QR code:', error);
      doc.text('QR code generation failed', 70, 150);
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('This e-ticket must be presented at the venue', 15, 220);
    doc.text(`Booking Reference: ${ticket.id}`, 15, 227);
    doc.text(`Booking Date: ${new Date(ticket.bookingDate).toLocaleDateString()}`, 15, 234);
    
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
