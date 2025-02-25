import { create } from 'zustand';
import brain from 'brain';
import type { User } from 'firebase/auth';

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Person {
  name: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  address?: Address;
  nationalId?: string;
  email?: string;
  phone?: string;
}

export interface Asset {
  id: string;
  type: 'real_estate' | 'vehicle' | 'bank_account' | 'securities' | 'other';
  description: string;
  estimatedValue: number;
  documents?: string[];
  metadata?: Record<string, any>;
}

export interface Debt {
  id: string;
  type: 'mortgage' | 'personal_loan' | 'credit_card' | 'other';
  creditor: string;
  amount: number;
  documents?: string[];
  metadata?: Record<string, any>;
}

export interface Heir extends Person {
  relationship: 'child' | 'spouse' | 'parent' | 'sibling' | 'other';
  share?: number;
}

export interface Estate {
  id: string;
  userId: string;
  status: 'draft' | 'in_progress' | 'completed';
  deceased?: Person | null;
  heirs: Heir[];
  assets: Asset[];
  debts: Debt[];
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  estateName?: string;
  deceasedName?: string;
  progress?: number;
  tasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
}

interface EstateStore {
  estates: Estate[];
  currentEstate: Estate | null;
  loading: boolean;
  error: Error | null;
  // Actions
  createEstate: (userId: string) => Promise<Estate>;
  updateEstate: (estateId: string, data: Partial<Estate>) => Promise<void>;
  loadEstates: (userId: string) => void;
  setCurrentEstate: (estate: Estate | null) => void;
  createPaymentIntent: (estateId: string) => Promise<{ clientSecret: string, amount: number }>;
  getPaymentStatus: (paymentIntentId: string) => Promise<{ status: string, amount: number, receiptUrl: string | null }>;
}

export const useEstateStore = create<EstateStore>((set, get) => ({
  estates: [],
  currentEstate: null,
  loading: false,
  error: null,

  createEstate: async (userId: string) => {
    try {
      const response = await brain.create_estate();
      const estate = await response.json();

      set(state => ({
        estates: [...state.estates, estate],
        currentEstate: estate,
      }));

      return estate;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateEstate: async (estateId: string, data: Partial<Estate>) => {
    try {
      const response = await brain.update_estate({ estate_id: estateId }, data);
      const updatedEstate = await response.json();

      set(state => ({
        estates: state.estates.map(estate =>
          estate.id === estateId ? updatedEstate : estate
        ),
        currentEstate: state.currentEstate?.id === estateId
          ? updatedEstate
          : state.currentEstate,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteEstate: async (estateId: string) => {
    try {
      await brain.delete_estate({ estate_id: estateId });

      set(state => ({
        estates: state.estates.filter(estate => estate.id !== estateId),
        currentEstate: state.currentEstate?.id === estateId
          ? null
          : state.currentEstate,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  loadEstates: async (userId: string) => {
    try {
      set({ loading: true });
      const response = await brain.list_estates();
      const estates = await response.json();

      set({
        estates,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error as Error,
        loading: false,
      });
    }
  },

  createPaymentIntent: async (estateId: string) => {
    try {
      const response = await brain.create_payment_intent({ estate_id: estateId });
      const data = await response.json();
      return {
        clientSecret: data.client_secret,
        amount: data.amount,
      };
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  getPaymentStatus: async (paymentIntentId: string) => {
    try {
      const response = await brain.get_payment_status({ payment_intent_id: paymentIntentId });
      const data = await response.json();
      return {
        status: data.status,
        amount: data.amount,
        receiptUrl: data.receipt_url,
      };
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  setCurrentEstate: (estate: Estate | null) => {
    set({ currentEstate: estate });
  },
}));
