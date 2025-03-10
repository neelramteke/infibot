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
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [ticketPdfUrl, setTicketPdfUrl] = useState<string>('');
  const [chatState, setChatState] = useState<
    'initial' | 'citySelection' | 'categorySelection' | 'eventSelection' | 'eventInfo' | 'ticketQuantity' | 'userForm' | 'complete'
  >('initial');

  useEffect(() => {
    const initChat = async () => {
      try {
        const citiesData = await eventsService.getIndianCities();
        setCities(citiesData);
        
        const categoriesData = await eventsService.getEventCategories();
        setCategories(categoriesData);
        
        const welcomeMessage = await geminiService.getWelcomeMessage();
        addBotMessage(welcomeMessage, 'text');
        
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

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
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
      } else if (chatState === 'eventInfo') {
        await handleEventInfoSubmission(content);
      } else if (chatState === 'ticketQuantity') {
        await handleTicketQuantitySubmission(content);
      } else if (chatState === 'userForm') {
        const aiResponse = await geminiService.getWelcomeMessage();
        addBotMessage(aiResponse, 'text');
      } else {
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
  }, [chatState, cities, categories, selectedCity, selectedCategory, selectedEvent, ticketQuantity]);

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

  const handleCitySelection = useCallback(async (cityName: string) => {
    const matchedCity = cities.find(
      city => city.name.toLowerCase() === cityName.toLowerCase()
    );
    
    if (!matchedCity) {
      addBotMessage(
        `I couldn't find ${cityName} in our list. Please select one of these cities:`,
        'citySelection',
        { options: cities.map(city => city.name) }
      );
      return;
    }
    
    setSelectedCity(matchedCity.name);
    
    const response = await geminiService.getCitySelectionResponse(matchedCity.name);
    
    addBotMessage(
      response,
      'categorySelection',
      { options: categories.map(category => category.name) }
    );
    
    setChatState('categorySelection');
  }, [cities, categories, addBotMessage]);

  const handleCategorySelection = useCallback(async (categoryName: string) => {
    const matchedCategory = categories.find(
      category => category.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!matchedCategory) {
      addBotMessage(
        `I couldn't find ${categoryName} in our list. Please select one of these categories:`,
        'categorySelection',
        { options: categories.map(category => category.name) }
      );
      return;
    }
    
    setSelectedCategory(matchedCategory.name);
    
    const eventsData = await eventsService.getEventsByCityAndCategory(selectedCity, matchedCategory.name);
    setEvents(eventsData);
    
    const response = await geminiService.getCategorySelectionResponse(selectedCity, matchedCategory.name);
    
    addBotMessage(
      response,
      'eventSelection',
      { events: eventsData }
    );
    
    setChatState('eventSelection');
  }, [selectedCity, categories, addBotMessage]);

  const handleEventSelection = useCallback(async (eventName: string) => {
    const matchedEvent = events.find(
      event => event.name.toLowerCase() === eventName.toLowerCase() || 
               event.id.toLowerCase() === eventName.toLowerCase()
    );
    
    if (!matchedEvent) {
      addBotMessage(
        `I couldn't find "${eventName}" in our list. Please select one of these events:`,
        'eventSelection',
        { events }
      );
      return;
    }
    
    setSelectedEvent(matchedEvent);
    
    const response = await geminiService.getEventSelectionResponse(matchedEvent.name);
    
    addBotMessage(
      response,
      'eventInfo',
      { selectedEvent: matchedEvent }
    );
    
    setChatState('eventInfo');
  }, [events, addBotMessage]);

  const handleEventInfoSubmission = useCallback(async (content: string) => {
  }, [selectedEvent]);

  const handleTicketQuantitySubmission = useCallback(async (content: string) => {
    if (!selectedEvent) {
      toast.error('No event selected. Please start over.');
      return;
    }

    try {
      const quantityMatch = content.match(/(\d+)\s*ticket/i);
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : ticketQuantity;

      if (quantity < 1 || quantity > 10) {
        addBotMessage('Please select between 1 and 10 tickets.', 'ticketQuantity', { 
          selectedEvent, 
          ticketQuantity: ticketQuantity 
        });
        return;
      }

      const priceValue = parseInt(selectedEvent.price.replace(/[^\d]/g, ''));
      const total = `₹${priceValue * quantity}`;
      
      setTicketQuantity(quantity);
      setTotalAmount(total);

      const userInfoPrompt = await geminiService.getUserInfoPrompt(selectedEvent.name);
      
      addBotMessage(
        userInfoPrompt,
        'userForm',
        { 
          selectedEvent, 
          ticketQuantity: quantity,
          totalAmount: total
        }
      );
      
      setChatState('userForm');
    } catch (error) {
      console.error('Error processing ticket quantity:', error);
      addBotMessage(
        "I encountered an issue. Please try selecting a ticket quantity again.",
        'ticketQuantity',
        { selectedEvent }
      );
    }
  }, [selectedEvent, ticketQuantity, addBotMessage]);

  const bookEvent = useCallback(async (eventId: string) => {
    const matchedEvent = events.find(event => event.id === eventId);
    
    if (!matchedEvent) {
      toast.error('Event not found. Please try again.');
      return;
    }
    
    setSelectedEvent(matchedEvent);
    
    addBotMessage(
      `Great choice! How many tickets would you like to book for "${matchedEvent.name}"?`,
      'ticketQuantity',
      { selectedEvent: matchedEvent }
    );
    
    setChatState('ticketQuantity');
  }, [events, addBotMessage]);

  const selectTicketQuantity = useCallback(async (eventId: string, quantity: number) => {
    if (!selectedEvent) {
      toast.error('No event selected. Please start over.');
      return;
    }

    setTicketQuantity(quantity);
    
    const priceValue = parseInt(selectedEvent.price.replace(/[^\d]/g, ''));
    const total = `₹${priceValue * quantity}`;
    setTotalAmount(total);

    const userInfoPrompt = await geminiService.getUserInfoPrompt(selectedEvent.name);
    
    addBotMessage(
      userInfoPrompt,
      'userForm',
      { 
        selectedEvent, 
        ticketQuantity: quantity,
        totalAmount: total
      }
    );
    
    setChatState('userForm');
  }, [selectedEvent, addBotMessage]);

  const submitUserInfo = useCallback(async (userInfo: UserInfo) => {
    if (!selectedEvent) {
      toast.error('No event selected. Please start over.');
      return;
    }
    
    try {
      console.log('Saving user info to Supabase:', userInfo);
      
      const userId = await saveUserInfo(userInfo);
      
      if (!userId) {
        throw new Error('Failed to save user information');
      }
      
      console.log('User saved with ID:', userId);
      
      const bookingId = `${selectedEvent.id}-${userId}-${Date.now()}`;
      const qrCodeUrl = await eventsService.generateQRCode(bookingId);
      
      console.log('Generated QR code');
      
      const ticketPdf = await eventsService.generateTicketPDF(
        selectedEvent.name,
        userInfo.name,
        selectedEvent.date,
        qrCodeUrl,
        ticketQuantity,
        totalAmount
      );
      
      console.log('Generated ticket PDF');
      setTicketPdfUrl(ticketPdf);
      
      const savedBookingId = await saveBooking(
        selectedEvent.id, 
        userId,
        ticketPdf
      );
      
      if (!savedBookingId) {
        console.log('Warning: Failed to save booking, but proceeding with ticket generation');
      } else {
        console.log('Booking saved with ID:', savedBookingId);
      }
      
      const confirmationMessage = await geminiService.getBookingConfirmation(
        selectedEvent.name,
        userInfo.name
      );
      
      addBotMessage(
        confirmationMessage,
        'ticket',
        { ticketPdfUrl: ticketPdf }
      );
      
      setTimeout(() => {
        addBotMessage(
          `Thank you for booking with InfiBot! Your e-ticket has been generated successfully. You can download it or share it directly.`,
          'text'
        );
      }, 1000);
      
      setChatState('complete');
    } catch (error) {
      console.error('Error processing booking:', error);
      try {
        if (selectedEvent) {
          const fallbackBookingId = `${selectedEvent.id}-fallback-${Date.now()}`;
          const qrCodeUrl = await eventsService.generateQRCode(fallbackBookingId);
          
          const ticketPdf = await eventsService.generateTicketPDF(
            selectedEvent.name,
            userInfo.name,
            selectedEvent.date,
            qrCodeUrl,
            ticketQuantity,
            totalAmount
          );
          
          setTicketPdfUrl(ticketPdf);
          
          const confirmationMessage = await geminiService.getBookingConfirmation(
            selectedEvent.name,
            userInfo.name
          );
          
          addBotMessage(
            confirmationMessage,
            'ticket',
            { ticketPdfUrl: ticketPdf }
          );
          
          setChatState('complete');
        }
      } catch (fallbackError) {
        console.error('Error in fallback ticket generation:', fallbackError);
        addBotMessage(
          "Your booking was processed but there was an issue generating your ticket. Please contact support.",
          'text'
        );
      }
    }
  }, [selectedEvent, ticketQuantity, totalAmount, addBotMessage]);

  const selectCity = useCallback(async (cityName: string) => {
    await sendMessage(cityName);
  }, [sendMessage]);

  const selectCategory = useCallback(async (categoryName: string) => {
    await sendMessage(categoryName);
  }, [sendMessage]);

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
    selectTicketQuantity,
    chatState,
  };
}

export default useChat;
