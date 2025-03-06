
import React, { useState } from 'react';
import { toast } from 'sonner';
import { UserInfo } from '@/lib/types';

interface UserFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: 0,
    gender: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: name === 'age' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!userInfo.name || !userInfo.age || !userInfo.gender || !userInfo.phone || !userInfo.email) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (userInfo.age < 5 || userInfo.age > 120) {
      toast.error('Please enter a valid age');
      return;
    }
    
    if (!/^[0-9]{10}$/.test(userInfo.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    onSubmit(userInfo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-2">
      <div>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="input-primary text-sm"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="number"
            name="age"
            value={userInfo.age || ''}
            onChange={handleChange}
            placeholder="Age"
            min="5"
            max="120"
            className="input-primary text-sm"
            required
          />
        </div>
        
        <div>
          <select
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
            className="input-primary text-sm"
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div>
        <input
          type="tel"
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          placeholder="Phone Number (10 digits)"
          pattern="[0-9]{10}"
          className="input-primary text-sm"
          required
        />
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="input-primary text-sm"
          required
        />
      </div>
      
      <button
        type="submit"
        className="btn-primary w-full text-sm"
      >
        Submit Booking
      </button>
    </form>
  );
};

export default UserForm;
