
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Event, UserInfo, City, EventCategory } from '@/lib/types';
import geminiService from '@/services/geminiService';
import eventsService from '@/services/eventsService';
import { saveUserInfo, saveBooking, getTicketDetails } from '@/services/supabaseClient';
import { toast } from 'sonner';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ticketPdfUrl, setTicketPdfUrl] = useState<string>('');
  const [chatState, setChatState] = useState<
    'initial' | 'citySelection' | 'categorySelection' | 'eventSelection' | 'eventInfo' | 'userForm' | 'complete'
  >('initial');

  // Initialize chat waiting for user message
  useEffect(() => {
    const initChat = async () => {
      try {
        const citiesData = await eventsService.getIndianCities();
        setCities(citiesData);
        
        const categoriesData = await eventsService.getEventCategories();
        setCategories(categoriesData);
        
        // Start with a guidance message
        const welcomeMessage = await geminiService.getWelcomeMessage();
        addBotMessage(welcomeMessage, 'text');
        
        // After greeting, show city selection
        addBotMessage(
          'Please select a city where you want to explore events:',
          'citySelection',
          { options: citiesData.map(city => city.name) }
        );
        
        setChatState('citySelection');
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Unable to load cities. Please refresh the page.');
      }
    };
    
    initChat();
  }, []);

  // Send message from user
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to the chat
    const userMessageId = uuidv4();
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      if (chatState === 'citySelection') {
        await handleCitySelection(content);
      } else if (chatState === 'categorySelection') {
        await handleCategorySelection(content);
      } else if (chatState === 'eventSelection') {
        await handleEventSelection(content);
      } else if (chatState === 'userForm') {
        await handleUserFormSubmission(content);
      } else {
        // Default fallback for free text
        const aiResponse = await geminiService.getWelcomeMessage();
        addBotMessage(aiResponse, 'text');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage(
        "I'm having trouble processing your request. Please try selecting one of the options above.",
        'text'
      );
    } finally {
      setLoading(false);
    }
  }, [chatState, cities, categories, selectedCity, selectedCategory, selectedEvent]);

  // Helper to add bot message
  const addBotMessage = useCallback((content: string, type: ChatMessage['type'] = 'text', extras = {}) => {
    const botMessage: ChatMessage = {
      id: uuidv4(),
      role: 'bot',
      content,
      timestamp: new Date(),
      type,
      ...extras,
    };
    
    setMessages(prev => [...prev, botMessage]);
  }, []);

  // Handle city selection
  const handleCitySelection = useCallback(async (cityName: string) => {
    const matchedCity = cities.find(
      city => city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (!matchedCity) {
      // City not found, ask again
      addBotMessage(
        `I couldn't find ${cityName} in our list. Please select one of these cities:`,
        'citySelection',
        { options: cities.map(city => city.name) }
      );
      return;
    }
    
    setSelectedCity(matchedCity.name);
    
    // Get response from AI
    const response = await geminiService.getCitySelectionResponse(matchedCity.name);
    
    // Add bot message with category selection
    addBotMessage(
      response,
      'categorySelection',
      { options: categories.map(category => category.name) }
    );
    
    setChatState('categorySelection');
  }, [cities, categories, addBotMessage]);

  // Handle category selection
  const handleCategorySelection = useCallback(async (categoryName: string) => {
    const matchedCategory = categories.find(
      category => category.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!matchedCategory) {
      // Category not found, ask again
      addBotMessage(
        `I couldn't find ${categoryName} in our list. Please select one of these categories:`,
        'categorySelection',
        { options: categories.map(category => category.name) }
      );
      return;
    }
    
    setSelectedCategory(matchedCategory.name);
    
    // Get events for the selected city and category
    const eventsData = await eventsService.getEventsByCityAndCategory(selectedCity, matchedCategory.name);
    setEvents(eventsData);
    
    // Get response from AI
    const response = await geminiService.getCategorySelectionResponse(selectedCity, matchedCategory.name);
    
    // Add bot message with event selection
    addBotMessage(
      response,
      'eventSelection',
      { events: eventsData }
    );
    
    setChatState('eventSelection');
  }, [selectedCity, categories, addBotMessage]);

  // Handle event selection
  const handleEventSelection = useCallback(async (eventName: string) => {
    const matchedEvent = events.find(
      event => event.name.toLowerCase() === eventName.toLowerCase() || 
               event.id.toLowerCase() === eventName.toLowerCase()
    );
    
    if (!matchedEvent) {
      // Event not found, ask again
      addBotMessage(
        `I couldn't find "${eventName}" in our list. Please select one of these events:`,
        'eventSelection',
        { events }
      );
      return;
    }
    
    setSelectedEvent(matchedEvent);
    
    // Get response from AI
    const response = await geminiService.getEventSelectionResponse(matchedEvent.name);
    
    // Add bot message with event info
    addBotMessage(
      response,
      'eventInfo',
      { selectedEvent: matchedEvent }
    );
    
    setChatState('eventInfo');
  }, [events, addBotMessage]);

  // Handle book event button click
  const bookEvent = useCallback(async (eventId: string) => {
    const matchedEvent = events.find(event => event.id === eventId);
    
    if (!matchedEvent) {
      toast.error('Event not found. Please try again.');
      return;
    }
    
    setSelectedEvent(matchedEvent);
    
    // Get user info prompt
    const userInfoPrompt = await geminiService.getUserInfoPrompt(matchedEvent.name);
    
    addBotMessage(
      userInfoPrompt,
      'userForm',
      { selectedEvent: matchedEvent }
    );
    
    setChatState('userForm');
  }, [events, addBotMessage]);

  // Handle user form submission
  const handleUserFormSubmission = useCallback(async (formData: string) => {
    if (!selectedEvent) {
      toast.error('No event selected. Please start over.');
      return;
    }
    
    try {
      // Parse user info from form data
      // This is a simple parsing approach; in a real app, you would use a form component
      const lines = formData.split('\n').filter(line => line.trim());
      const userInfo: UserInfo = {
        name: lines.find(line => line.toLowerCase().includes('name'))?.split(':')[1]?.trim() || '',
        age: parseInt(lines.find(line => line.toLowerCase().includes('age'))?.split(':')[1]?.trim() || '0'),
        gender: lines.find(line => line.toLowerCase().includes('gender'))?.split(':')[1]?.trim() || '',
        phone: lines.find(line => line.toLowerCase().includes('phone'))?.split(':')[1]?.trim() || '',
        email: lines.find(line => line.toLowerCase().includes('email'))?.split(':')[1]?.trim() || '',
      };
      
      if (!userInfo.name || !userInfo.email || !userInfo.phone) {
        addBotMessage(
          'Please provide all required information in the format: Name: Your Name, Age: Your Age, Gender: Your Gender, Phone: Your Phone, Email: Your Email',
          'userForm',
          { selectedEvent }
        );
        return;
      }
      
      // Save user info to Supabase
      const userId = await saveUserInfo(userInfo);
      
      if (!userId) {
        throw new Error('Failed to save user information');
      }
      
      // Generate QR code
      const bookingId = `${selectedEvent.id}-${userId}-${Date.now()}`;
      const qrCodeUrl = await eventsService.generateQRCode(bookingId);
      
      // Generate ticket PDF
      const ticketPdf = await eventsService.generateTicketPDF(
        selectedEvent.name,
        userInfo.name,
        selectedEvent.date,
        qrCodeUrl
      );
      
      setTicketPdfUrl(ticketPdf);
      
      // Save booking to Supabase
      const savedBookingId = await saveBooking(selectedEvent.id, userId, ticketPdf, qrCodeUrl);
      
      if (!savedBookingId) {
        throw new Error('Failed to save booking');
      }
      
      // Get booking confirmation message
      const confirmationMessage = await geminiService.getBookingConfirmation(
        selectedEvent.name,
        userInfo.name
      );
      
      // Add bot message with ticket
      addBotMessage(
        confirmationMessage,
        'ticket',
        { ticketPdfUrl: ticketPdf }
      );
      
      // Add thank you message
      setTimeout(() => {
        addBotMessage(
          `Thank you for booking with InfiBot! We hope you enjoy your event. Your e-ticket is ready for download or sharing.`,
          'text'
        );
      }, 1000);
      
      setChatState('complete');
    } catch (error) {
      console.error('Error processing booking:', error);
      addBotMessage(
        "I encountered an issue while processing your booking. Please check your information and try again.",
        'text'
      );
    }
  }, [selectedEvent, addBotMessage]);

  // Submit user info from form component
  const submitUserInfo = useCallback(async (userInfo: UserInfo) => {
    if (!selectedEvent) {
      toast.error('No event selected. Please start over.');
      return;
    }
    
    try {
      console.log('Saving user info to Supabase:', userInfo);
      
      // Save user info to Supabase
      const userId = await saveUserInfo(userInfo);
      
      if (!userId) {
        throw new Error('Failed to save user information');
      }
      
      console.log('User saved with ID:', userId);
      
      // Generate QR code
      const bookingId = `${selectedEvent.id}-${userId}-${Date.now()}`;
      const qrCodeUrl = await eventsService.generateQRCode(bookingId);
      
      console.log('Generated QR code');
      
      // Generate ticket PDF
      const ticketPdf = await eventsService.generateTicketPDF(
        selectedEvent.name,
        userInfo.name,
        selectedEvent.date,
        qrCodeUrl
      );
      
      console.log('Generated ticket PDF');
      setTicketPdfUrl(ticketPdf);
      
      // Save booking to Supabase
      console.log('Saving booking to Supabase');
      const savedBookingId = await saveBooking(selectedEvent.id, userId, ticketPdf, qrCodeUrl);
      
      if (!savedBookingId) {
        throw new Error('Failed to save booking');
      }
      
      console.log('Booking saved with ID:', savedBookingId);
      
      // Get booking confirmation message
      const confirmationMessage = await geminiService.getBookingConfirmation(
        selectedEvent.name,
        userInfo.name
      );
      
      // Add bot message with ticket
      addBotMessage(
        confirmationMessage,
        'ticket',
        { ticketPdfUrl: ticketPdf }
      );
      
      // Add thank you message
      setTimeout(() => {
        addBotMessage(
          `Thank you for booking with InfiBot! Your e-ticket has been generated successfully. You can download it or share it directly.`,
          'text'
        );
      }, 1000);
      
      setChatState('complete');
    } catch (error) {
      console.error('Error processing booking:', error);
      addBotMessage(
        "I'm sorry, but there was an issue processing your booking. Please try again or contact support if the problem persists.",
        'text'
      );
    }
  }, [selectedEvent, addBotMessage]);

  // Select city directly from options
  const selectCity = useCallback(async (cityName: string) => {
    await sendMessage(cityName);
  }, [sendMessage]);

  // Select category directly from options
  const selectCategory = useCallback(async (categoryName: string) => {
    await sendMessage(categoryName);
  }, [sendMessage]);

  // Select event directly from options
  const selectEvent = useCallback(async (eventName: string) => {
    await sendMessage(eventName);
  }, [sendMessage]);

  return {
    messages,
    loading,
    sendMessage,
    selectCity,
    selectCategory,
    selectEvent,
    bookEvent,
    submitUserInfo,
    chatState,
  };
}

export default useChat;
