
import { createClient } from '@supabase/supabase-js';
import { UserInfo, Event, Ticket } from '@/lib/types';
import { toast } from 'sonner';

// In a production app, these would be environment variables
const supabaseUrl = 'https://ctgcaaybpsultttvuvqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Z2NhYXlicHN1bHR0dHZ1dnFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDAxNzUsImV4cCI6MjA1NjgxNjE3NX0.930-iapP70dSrp_3TaO9iOC-LkmjZhy7o-EN0yO1zxg';

const supabase = createClient(supabaseUrl, supabaseKey);

export const saveUserInfo = async (userInfo: UserInfo) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        name: userInfo.name,
        age: userInfo.age,
        gender: userInfo.gender,
        phone: userInfo.phone,
        email: userInfo.email,
      })
      .select('id');

    if (error) throw error;
    return data?.[0]?.id;
  } catch (error) {
    console.error('Error saving user info:', error);
    toast.error('Failed to save user information');
    return null;
  }
};

export const saveBooking = async (eventId: string, userId: string, ticketImage: string, qrCode: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        user_id: userId,
        booking_date: new Date().toISOString(),
        ticket_image: ticketImage,
        qr_code: qrCode,
      })
      .select('id');

    if (error) throw error;
    return data?.[0]?.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    toast.error('Failed to save booking');
    return null;
  }
};

export const getTicketDetails = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_date,
        ticket_image,
        qr_code,
        events:event_id(id, name),
        users:user_id(name, email)
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    
    // The join query returns nested objects, we need to access their properties correctly
    return {
      ticketId: data.id,
      eventId: data.events?.[0]?.id,
      eventName: data.events?.[0]?.name,
      userName: data.users?.[0]?.name,
      userEmail: data.users?.[0]?.email,
      bookingDate: data.booking_date,
      ticketImage: data.ticket_image,
      qrCode: data.qr_code,
    };
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    toast.error('Failed to fetch ticket details');
    return null;
  }
};

export default supabase;
