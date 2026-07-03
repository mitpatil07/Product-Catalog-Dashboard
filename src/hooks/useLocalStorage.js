import { useState, useEffect } from 'react';

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apex Keyboard Pro',
    category: 'Electronics',
    price: 189.99,
    quantity: 15,
    status: 'Active',
    description: 'High-performance mechanical keyboard with customizable RGB backlighting and tactile switches.'
  },
  {
    id: 'prod-2',
    name: 'Nova Ergonomic Mouse',
    category: 'Electronics',
    price: 79.50,
    quantity: 42,
    status: 'Active',
    description: 'Wireless ergonomic mouse featuring high precision tracking and silent click design.'
  },
  {
    id: 'prod-3',
    name: 'Quantum UltraWide Monitor',
    category: 'Electronics',
    price: 349.99,
    quantity: 8,
    status: 'Active',
    description: '34-inch curved ultra-wide gaming monitor with 144Hz refresh rate and crisp color accuracy.'
  },
  {
    id: 'prod-4',
    name: 'Vertex Journal Notebook',
    category: 'Stationery',
    price: 24.99,
    quantity: 120,
    status: 'Active',
    description: 'Premium dotted grid notebook with thick acid-free pages and durable vegan leather cover.'
  },
  {
    id: 'prod-5',
    name: 'Helix Fountain Pen',
    category: 'Stationery',
    price: 45.00,
    quantity: 0,
    status: 'Inactive',
    description: 'Refillable metal body fountain pen with medium nib for smooth signature writing.'
  },
  {
    id: 'prod-6',
    name: 'Zenith Felt Desk Pad',
    category: 'Home Office',
    price: 35.00,
    quantity: 60,
    status: 'Active',
    description: 'Minimalist merino wool felt desk mat to protect your workspace and organize your gear.'
  },
  {
    id: 'prod-7',
    name: 'Orbit wireless Charger',
    category: 'Electronics',
    price: 59.99,
    quantity: 25,
    status: 'Active',
    description: 'Magnetic 3-in-1 fast-charging stand for iPhone, Apple Watch, and AirPods.'
  },
  {
    id: 'prod-8',
    name: 'Aura Ambient Smart Lamp',
    category: 'Home Office',
    price: 89.99,
    quantity: 0,
    status: 'Inactive',
    description: 'App-controlled RGB LED desk lamp with dimmable ambient light scenes and wake-up timer.'
  }
];

export function useLocalStorage(key, initialValue) {
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      
      // If it exists, parse and return it
      if (item) {
        return JSON.parse(item);
      }
      
      // Seed default products if key is 'products' and empty
      if (key === 'products') {
        window.localStorage.setItem(key, JSON.stringify(MOCK_PRODUCTS));
        return MOCK_PRODUCTS;
      }
      
      // Default fallback
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing localStorage key:', key, error);
    }
  };

  return [storedValue, setValue];
}
