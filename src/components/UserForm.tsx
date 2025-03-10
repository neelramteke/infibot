
import React, { useState } from 'react';
import { Button } from './ui/button';
import { UserInfo } from '@/lib/types';

export interface UserFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  eventId: string;
  quantity?: number;
  totalAmount?: string;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, eventId, quantity = 1, totalAmount = '₹0' }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    age: 18,
    gender: 'Male',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.age < 5 || formData.age > 120) {
      newErrors.age = 'Age must be between 5 and 120';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border p-4">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-primary"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input-primary"
            min="5"
            max="120"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input-primary"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-primary"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-primary"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      
      <div className="border-t border-border pt-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Ticket Quantity:</span>
          <span className="font-semibold">{quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Total Amount:</span>
          <span className="font-bold text-primary">{totalAmount}</span>
        </div>
      </div>
      
      <Button type="submit" className="w-full btn-gradient">
        Complete Booking
      </Button>
    </form>
  );
};

export default UserForm;
