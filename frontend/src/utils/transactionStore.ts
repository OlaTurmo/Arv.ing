import { create } from 'zustand';
import brain from 'brain';

export interface Transaction {
  id: string;
  date: string;
  recipient: string;
  amount: number;
  category: string;
  is_subscription: boolean;
  subscription_frequency?: string;
  contact_info?: Record<string, any>;
  user_confirmed?: boolean;
  user_corrected?: {
    is_subscription: boolean;
    category: string;
    subscription_frequency?: string;
  };
  cancellation_status?: {
    status: string;
    history: Array<{
      status: string;
      timestamp: string;
      comment: string;
    }>;
  };
}

export interface TransactionList {
  transactions: Transaction[];
  estate_id: string;
}

export interface CancellationRequest {
  transaction_id: string;
  estate_id: string;
  cancellation_method: string;
  contact_info: Record<string, any>;
  cancellation_letter?: string;
  cancellation_email?: string;
}

export interface CancellationResponse {
  transaction_id: string;
  cancellation_letter?: string;
  cancellation_email?: string;
  contact_info: Record<string, any>;
}

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  // Actions
  uploadTransactions: (estateId: string, file: File) => Promise<void>;
  loadTransactions: (estateId: string) => Promise<void>;
  cancelSubscription: (request: CancellationRequest) => Promise<CancellationResponse>;
  confirmTransaction: (transactionId: string, confirmed: boolean) => void;
  correctTransaction: (transactionId: string, corrections: {
    is_subscription: boolean;
    category: string;
    subscription_frequency?: string;
  }) => void;
  loadCancellationStatus: (estateId: string, transactionId: string) => Promise<void>;
  updateCancellationStatus: (estateId: string, transactionId: string, update: {
    status: string;
    comment: string;
  }) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  uploadTransactions: async (estateId: string, file: File) => {
    set({ loading: true, error: null });
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:image/png;base64, prefix
        };
        reader.onerror = reject;
      });

      const response = await brain.upload_transactions(
        { estateId },
        { file: base64 }
      );
      const data = await response.json();

      set(state => ({
        transactions: [...state.transactions, ...data.transactions],
        loading: false,
      }));
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  loadTransactions: async (estateId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await brain.get_transactions({ estate_id: estateId });
      const data = await response.json();

      set({
        transactions: data.transactions,
        loading: false,
      });
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  cancelSubscription: async (request: CancellationRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await brain.cancel_subscription(request);
      const data = await response.json();

      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error as Error, loading: false });
      throw error;
    }
  },

  confirmTransaction: (transactionId: string, confirmed: boolean) => {
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === transactionId
          ? { ...t, user_confirmed: confirmed }
          : t
      ),
    }));

    // Store the feedback for AI training
    const transaction = get().transactions.find(t => t.id === transactionId);
    if (transaction) {
      const feedbackKey = `feedback/${transactionId}`;
      const feedback = {
        transaction,
        user_confirmed: confirmed,
        timestamp: new Date().toISOString(),
      };
      // Store feedback in Firestore for future AI training
      // This will be implemented when we add Firestore
    }
  },

  correctTransaction: (transactionId: string, corrections: {
    is_subscription: boolean;
    category: string;
    subscription_frequency?: string;
  }) => {
    set(state => ({
      transactions: state.transactions.map(t =>
        t.id === transactionId
          ? { ...t, user_corrected: corrections }
          : t
      ),
    }));

    // Store the corrections for AI training
    const transaction = get().transactions.find(t => t.id === transactionId);
    if (transaction) {
      const feedbackKey = `corrections/${transactionId}`;
      const feedback = {
        transaction,
        corrections,
        timestamp: new Date().toISOString(),
      };
      // Store corrections in Firestore for future AI training
      // This will be implemented when we add Firestore
    }
  },

  loadCancellationStatus: async (estateId: string, transactionId: string) => {
    try {
      const response = await brain.get_cancellation_status({ estate_id: estateId, transaction_id: transactionId });
      if (response.ok) {
        const status = await response.json();
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === transactionId
              ? { ...t, cancellation_status: status }
              : t
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to load cancellation status:', error);
    }
  },

  updateCancellationStatus: async (estateId: string, transactionId: string, update: {
    status: string;
    comment: string;
  }) => {
    try {
      const response = await brain.update_cancellation_status(
        { estate_id: estateId, transaction_id: transactionId },
        update
      );

      if (response.ok) {
        const status = await response.json();
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === transactionId
              ? { ...t, cancellation_status: status }
              : t
          ),
        }));
      }
    } catch (error) {
      console.error('Failed to update cancellation status:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
