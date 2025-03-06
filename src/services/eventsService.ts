
import { City, EventCategory, Event } from '@/lib/types';
import { toast } from 'sonner';

// In a production app, we would fetch this data from a real API
// This is a mock implementation for demonstration purposes

// Get Indian cities
export const getIndianCities = async (): Promise<City[]> => {
  try {
    // In a real app, we would make an API call to get city data
    // For demonstration, we'll return mock data
    return [
      { id: '1', name: 'Mumbai', state: 'Maharashtra' },
      { id: '2', name: 'Delhi', state: 'Delhi' },
      { id: '3', name: 'Bangalore', state: 'Karnataka' },
      { id: '4', name: 'Hyderabad', state: 'Telangana' },
      { id: '5', name: 'Chennai', state: 'Tamil Nadu' },
      { id: '6', name: 'Kolkata', state: 'West Bengal' },
      { id: '7', name: 'Pune', state: 'Maharashtra' },
      { id: '8', name: 'Jaipur', state: 'Rajasthan' },
      { id: '9', name: 'Ahmedabad', state: 'Gujarat' },
      { id: '10', name: 'Lucknow', state: 'Uttar Pradesh' }
    ];
  } catch (error) {
    console.error('Error fetching cities:', error);
    toast.error('Failed to load cities');
    return [];
  }
};

// Get event categories
export const getEventCategories = async (): Promise<EventCategory[]> => {
  try {
    // In a real app, we would make an API call to get category data
    return [
      { id: '1', name: 'Cultural', description: 'Traditional performances and cultural celebrations' },
      { id: '2', name: 'Music', description: 'Concerts, live performances, and music festivals' },
      { id: '3', name: 'Comedy', description: 'Stand-up comedy shows and humorous performances' },
      { id: '4', name: 'Sports', description: 'Sporting events and competitions' },
      { id: '5', name: 'Art', description: 'Art exhibitions and creative showcases' },
      { id: '6', name: 'Workshop', description: 'Learning sessions and skill development workshops' }
    ];
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error('Failed to load event categories');
    return [];
  }
};

// Get events by city and category
export const getEventsByCityAndCategory = async (city: string, category: string): Promise<Event[]> => {
  try {
    // In a real app, we would make an API call to get event data
    // For demonstration, we'll return mock data based on the inputs
    
    // Generate some dynamic events based on city and category
    const baseEvents = [
      {
        id: `${city}-${category}-1`,
        name: `${category} Festival ${new Date().getFullYear()}`,
        description: `The biggest ${category.toLowerCase()} festival in ${city}, featuring top artists and performers from around the country.`,
        category,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: '6:00 PM',
        venue: `${city} Convention Center`,
        city,
        price: '₹1500 - ₹3000',
        image: `https://picsum.photos/seed/${city}-${category}-1/400/200`
      },
      {
        id: `${city}-${category}-2`,
        name: `${city} ${category} Week`,
        description: `A week-long celebration of ${category.toLowerCase()} with various events and activities throughout the city.`,
        category,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: '10:00 AM',
        venue: `${city} Central Park`,
        city,
        price: '₹500 - ₹1000',
        image: `https://picsum.photos/seed/${city}-${category}-2/400/200`
      },
      {
        id: `${city}-${category}-3`,
        name: `${category} Showcase ${new Date().getFullYear()}`,
        description: `Experience the best of ${category.toLowerCase()} with this showcase event featuring both established and emerging talents.`,
        category,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: '7:30 PM',
        venue: `${city} Auditorium`,
        city,
        price: '₹1000 - ₹2500',
        image: `https://picsum.photos/seed/${city}-${category}-3/400/200`
      }
    ];
    
    // Add some category-specific events
    let specialEvents: Event[] = [];
    
    if (category === 'Music') {
      specialEvents = [
        {
          id: `${city}-music-special-1`,
          name: `Rock Night in ${city}`,
          description: `A night of rock music featuring local bands and a special guest performance.`,
          category: 'Music',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: '8:00 PM',
          venue: `${city} Stadium`,
          city,
          price: '₹2000 - ₹4000',
          image: `https://picsum.photos/seed/${city}-music-special-1/400/200`
        }
      ];
    } else if (category === 'Cultural') {
      specialEvents = [
        {
          id: `${city}-cultural-special-1`,
          name: `Traditional Dance Festival in ${city}`,
          description: `Experience the rich cultural heritage through traditional dance forms from across India.`,
          category: 'Cultural',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          time: '6:30 PM',
          venue: `${city} Cultural Center`,
          city,
          price: '₹800 - ₹1500',
          image: `https://picsum.photos/seed/${city}-cultural-special-1/400/200`
        }
      ];
    }
    
    return [...baseEvents, ...specialEvents];
  } catch (error) {
    console.error('Error fetching events:', error);
    toast.error('Failed to load events');
    return [];
  }
};

// Generate a QR code (mock implementation)
export const generateQRCode = async (bookingId: string): Promise<string> => {
  // In a real app, we would generate a real QR code
  // For demonstration, we'll return a placeholder image
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(bookingId)}`;
};

// Generate a ticket image (mock implementation)
export const generateTicketImage = async (
  eventName: string,
  userName: string,
  eventDate: string,
  qrCodeUrl: string
): Promise<string> => {
  try {
    // In a real app, we would generate a real ticket image
    // For demonstration, we'll return the QR code as a placeholder
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating ticket:', error);
    toast.error('Failed to generate ticket image');
    return '';
  }
};

export default {
  getIndianCities,
  getEventCategories,
  getEventsByCityAndCategory,
  generateQRCode,
  generateTicketImage
};
