
export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  type?: 'text' | 'citySelection' | 'categorySelection' | 'eventSelection' | 'eventInfo' | 'userForm' | 'ticket';
  options?: string[];
  events?: Event[];
  selectedEvent?: Event;
  ticketImage?: string;
  ticketPdfUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: string;
  image?: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description: string;
}

export interface UserInfo {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: Date;
  qrCode: string;
  ticketImage?: string;
  ticketPdfUrl?: string;
}

export interface BookingDetails {
  eventId: string;
  eventName: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  ticketId: string;
  qrCode: string;
}
