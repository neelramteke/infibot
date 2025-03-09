
import { City, EventCategory, Event } from '@/lib/types';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

// Mock data for demo purposes
const MOCK_CITIES: City[] = [
  { id: '1', name: 'Mumbai', state: 'Maharashtra' },
  { id: '2', name: 'Delhi', state: 'Delhi' },
  { id: '3', name: 'Bangalore', state: 'Karnataka' },
  { id: '4', name: 'Chennai', state: 'Tamil Nadu' },
  { id: '5', name: 'Kolkata', state: 'West Bengal' },
  { id: '6', name: 'Hyderabad', state: 'Telangana' },
  { id: '7', name: 'Pune', state: 'Maharashtra' },
  { id: '8', name: 'Ahmedabad', state: 'Gujarat' },
  { id: '9', name: 'Jaipur', state: 'Rajasthan' },
];

const MOCK_CATEGORIES: EventCategory[] = [
  { id: '1', name: 'Music Concerts', description: 'Live music performances' },
  { id: '2', name: 'Cultural Events', description: 'Traditional and cultural showcases' },
  { id: '3', name: 'Comedy Shows', description: 'Stand-up comedy and humor shows' },
  { id: '4', name: 'Sports Events', description: 'Various sporting competitions' },
  { id: '5', name: 'Art Exhibitions', description: 'Showcases of visual art' },
  { id: '6', name: 'Workshops', description: 'Learning and skill-building sessions' },
];

const generateMockEvents = (city: string, category: string): Event[] => {
  const cityEvents = [];
  const today = new Date();
  
  for (let i = 1; i <= 5; i++) {
    const eventDate = new Date();
    eventDate.setDate(today.getDate() + i * 3);
    
    cityEvents.push({
      id: `${city}-${category}-${i}`,
      name: `${category} ${i} in ${city}`,
      description: `This is a great ${category.toLowerCase()} event happening in ${city}. Don't miss this amazing experience with talented performers and an incredible atmosphere!`,
      category,
      date: eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      time: `${6 + i}:00 PM`,
      venue: `${city} ${category} Arena`,
      city,
      price: `₹${500 * i}`,
      image: `https://source.unsplash.com/random/300x200?${category.toLowerCase().replace(/\s+/g, '-')},${i}`,
    });
  }
  
  return cityEvents;
};

// Service functions
export const getIndianCities = async (): Promise<City[]> => {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CITIES), 500);
  });
};

export const getEventCategories = async (): Promise<EventCategory[]> => {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_CATEGORIES), 500);
  });
};

export const getEventsByCityAndCategory = async (city: string, category: string): Promise<Event[]> => {
  // In a real app, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockEvents(city, category)), 800);
  });
};

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    // Adding "Ticket is verified" to the QR code data
    const qrData = JSON.stringify({
      eventData: text,
      message: "Ticket is verified"
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      margin: 1,
      width: 200,
      color: {
        dark: '#5E35B1',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

export const generateTicketPDF = async (
  eventName: string,
  userName: string,
  eventDate: string,
  qrCodeDataURL: string,
  quantity: number = 1,
  totalAmount: string = '₹0'
): Promise<string> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    
    // Add gradient background
    doc.setFillColor(230, 240, 255);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    
    // Add border
    doc.setDrawColor(94, 53, 177);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, 'S');
    
    // Add header
    doc.setFillColor(94, 53, 177);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('EVENT TICKET', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    // Add event name
    doc.setTextColor(94, 53, 177);
    doc.setFontSize(16);
    doc.text(eventName, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    
    // Add user name
    doc.setFontSize(12);
    doc.text(`Attendee: ${userName}`, doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
    
    // Add event date
    doc.text(`Date: ${eventDate}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    
    // Add ticket quantity and total amount
    doc.text(`Ticket Quantity: ${quantity}`, doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });
    doc.text(`Total Amount: ${totalAmount}`, doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });
    
    // Add QR code
    doc.addImage(qrCodeDataURL, 'PNG', 
      doc.internal.pageSize.getWidth() / 2 - 25, 90, 
      50, 50);
    
    // Add footer text
    doc.setFontSize(10);
    doc.text('Please present this ticket at the venue entrance', 
      doc.internal.pageSize.getWidth() / 2, 150, { align: 'center' });
    doc.text('Powered by InfiBot', 
      doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });
    
    // Convert to data URL
    const pdfDataUrl = doc.output('datauristring');
    
    return pdfDataUrl;
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    return '';
  }
};

export default {
  getIndianCities,
  getEventCategories,
  getEventsByCityAndCategory,
  generateQRCode,
  generateTicketPDF
};
