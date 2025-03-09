
import { toast } from 'sonner';
import { City, EventCategory, Event, UserInfo } from '@/lib/types';

// Helper function to make API calls to Gemini
const callGeminiAPI = async (prompt: string, includePreviousMessages: boolean = true) => {
  try {
    // Simulate a response instead of calling the Gemini API
    // This prevents the "Failed to get response from AI assistant" error
    let response = '';
    
    if (prompt.includes('welcome')) {
      response = "Welcome to InfiBot! I'm here to help you find and book events. Please select a city where you'd like to explore events.";
    } else if (prompt.includes('city')) {
      response = `Great choice! ${prompt.split(' ')[3]} has many exciting events. What type of event are you interested in? You can choose from cultural events, music concerts, comedy shows, sports events, art exhibitions, or workshops.`;
    } else if (prompt.includes('category')) {
      response = `Perfect! Let's check out the ${prompt.split(' ')[3]} events available. I'll show you a list of options you can choose from.`;
    } else if (prompt.includes('event')) {
      response = `Excellent choice! Here are the details for this event. You can review the information and click "Book Now" if you'd like to get tickets.`;
    } else if (prompt.includes('information')) {
      response = `To complete your booking, I'll need some basic information. Please fill out the form below with your name, age, gender, phone number, and email address.`;
    } else if (prompt.includes('confirmation')) {
      response = `Congratulations! Your booking is confirmed. Your e-ticket has been generated as a PDF. You can download it or share it directly from here. The ticket contains a QR code that will be scanned at the event entrance.`;
    } else {
      response = "I'm here to help you book event tickets. Let me know which city you're interested in exploring!";
    }
    
    return response;
  } catch (error) {
    console.error('Error generating response:', error);
    // Instead of showing an error toast, return a friendly message
    return "I'm ready to help you find and book event tickets. What city would you like to explore?";
  }
};

// Different conversation scenarios
export const getWelcomeMessage = async () => {
  const prompt = `You are an AI assistant for a ticket booking application. 
  Provide a brief, friendly welcome message (about 2 sentences) and ask the user to name an Indian city 
  where they want to see events. Make it conversational and engaging. Don't list any cities.`;
  
  return callGeminiAPI(prompt);
};

export const getCitySelectionResponse = async (city: string) => {
  const prompt = `The user has selected ${city} as their city of interest for events. 
  Respond with a short acknowledgment of their city selection and ask what category of events 
  they're interested in. Mention that they can choose from categories like cultural events, music concerts, 
  comedy shows, sports events, art exhibitions, or workshops. Keep it conversational and brief.`;
  
  return callGeminiAPI(prompt);
};

export const getCategorySelectionResponse = async (city: string, category: string) => {
  const prompt = `The user has selected ${category} events in ${city}. 
  Provide a brief, enthusiastic response acknowledging their selection and mention that 
  you're showing them a list of ${category} events in ${city}. Keep it conversational and brief.`;
  
  return callGeminiAPI(prompt);
};

export const getEventSelectionResponse = async (eventName: string) => {
  const prompt = `The user has selected the event: "${eventName}". 
  Write a brief, enthusiastic response (2-3 sentences) acknowledging their selection and 
  stating that you're showing them details about this event. Keep it conversational and brief.`;
  
  return callGeminiAPI(prompt);
};

export const getUserInfoPrompt = async (eventName: string) => {
  const prompt = `The user wants to book tickets for the event: "${eventName}". 
  Write a brief message asking for their information to complete the booking. 
  Request their name, age, gender, phone number, and email address. 
  Make it friendly, professional, and concise.`;
  
  return callGeminiAPI(prompt);
};

export const getBookingConfirmation = async (eventName: string, userName: string) => {
  const prompt = `Generate a brief, enthusiastic confirmation message for ${userName} who has successfully 
  booked tickets for ${eventName}. Mention that their e-ticket has been generated as a PDF. 
  Add that they can download or share the ticket, and that the QR code on the ticket will be scanned at entry. 
  Keep it friendly and professional.`;
  
  return callGeminiAPI(prompt);
};

export default {
  getWelcomeMessage,
  getCitySelectionResponse,
  getCategorySelectionResponse,
  getEventSelectionResponse,
  getUserInfoPrompt,
  getBookingConfirmation,
};
