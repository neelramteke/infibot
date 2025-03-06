
import { toast } from 'sonner';
import { City, EventCategory, Event, UserInfo } from '@/lib/types';

// In a production app, this would be an environment variable
const GEMINI_API_KEY = 'your-gemini-api-key';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Helper function to make API calls to Gemini
const callGeminiAPI = async (prompt: string, includePreviousMessages: boolean = true) => {
  try {
    // In a real implementation, we would include the conversation history
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) {
      throw new Error('No text response from Gemini');
    }

    return textResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    toast.error('Failed to get response from AI assistant');
    return 'I apologize, but I encountered an issue. Please try again later.';
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
  booked tickets for ${eventName}. Mention that their e-ticket has been generated and is being displayed. 
  Add that they can save the ticket image for entry to the event. Keep it friendly and professional.`;
  
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
