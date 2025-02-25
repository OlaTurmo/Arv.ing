import { create } from 'zustand';
import { firebaseApp } from 'app';
import { getFirestore, doc, setDoc, collection, query, where, onSnapshot, type DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const db = getFirestore(firebaseApp);

export type DocumentType = 'skifteattest' | 'fullmakt' | 'testamente';

export interface DocumentTemplate {
  id: string;
  userId: string;
  estateId?: string;
  type: DocumentType;
  title: string;
  content: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

interface DocumentStore {
  documents: DocumentTemplate[];
  isLoading: boolean;
  error: Error | null;
  // Initialize listener
  subscribeToDocuments: (user: User, estateId?: string) => () => void;
  // Create new document
  createDocument: (data: Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  // Update document
  updateDocument: (id: string, data: Partial<Omit<DocumentTemplate, 'id' | 'userId'>>) => Promise<void>;
}

export const defaultTemplates: Record<DocumentType, Record<string, string>> = {
  skifteattest: {
    fullName: '',
    dateOfDeath: '',
    placeOfDeath: '',
    lastResidence: '',
    nextOfKin: '',
    relationship: '',
  },
  fullmakt: {
    grantor: '',
    grantorAddress: '',
    attorney: '',
    attorneyAddress: '',
    scope: 'Jeg gir herved fullmakt til å representere meg i alle forhold vedrørende dødsboet etter [avdødes navn], herunder å motta informasjon, fatte beslutninger og signere dokumenter på mine vegne.',
    duration: 'Denne fullmakten gjelder fra dags dato og frem til dødsboet er endelig oppgjort.',
  },
  testamente: {
    testator: '',
    dateOfBirth: '',
    address: '',
    content: 'Undertegnede [navn], født [fødselsdato], bosatt i [adresse], erklærer herved at dette er mitt testamente:\n\n1. Jeg tilbakekaller herved alle tidligere testamenter.\n\n2. [Innhold]\n\n3. Dette testamentet er opprettet i to eksemplarer, hvorav jeg beholder det ene og det andre oppbevares hos [oppbevaringssted].',
    witnesses: '',
    place: '',
    date: '',
  },
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  isLoading: true,
  error: null,

  subscribeToDocuments: (user: User, estateId?: string) => {
    // Test data
    const testDocuments: DocumentTemplate[] = [
      {
        id: 'doc_1',
        userId: user.uid,
        estateId: 'estate_1',
        type: 'skifteattest',
        title: 'Skifteattest for Ole Hansen',
        content: {
          fullName: 'Ole Hansen',
          dateOfDeath: '2024-01-15',
          placeOfDeath: 'Oslo',
          lastResidence: 'Storgata 1, 0182 Oslo',
          nextOfKin: 'Kari Hansen',
          relationship: 'Datter'
        },
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3  // 3 days ago
      },
      {
        id: 'doc_2',
        userId: user.uid,
        estateId: 'estate_1',
        type: 'fullmakt',
        title: 'Fullmakt fra Kari Hansen',
        content: {
          grantor: 'Kari Hansen',
          grantorAddress: 'Lillegata 2, 0183 Oslo',
          attorney: 'Per Olsen',
          attorneyAddress: 'Storgata 5, 0182 Oslo',
          scope: 'Jeg gir herved fullmakt til å representere meg i alle forhold vedrørende dødsboet etter Ole Hansen, herunder å motta informasjon, fatte beslutninger og signere dokumenter på mine vegne.',
          duration: 'Denne fullmakten gjelder fra dags dato og frem til dødsboet er endelig oppgjort.'
        },
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2  // 2 days ago
      }
    ];

    // Filter by estateId if provided
    const documents = estateId
      ? testDocuments.filter(doc => doc.estateId === estateId)
      : testDocuments;

    // Set documents and loading state
    set({ documents, isLoading: false });

    // Return empty unsubscribe function
    return () => {};
  },

  createDocument: async (data) => {
    try {
      const docRef = doc(collection(db, 'documents'));
      const document: DocumentTemplate = {
        ...data,
        id: docRef.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(docRef, document);
      return docRef.id;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateDocument: async (id, data) => {
    try {
      const updateData = {
        ...data,
        updatedAt: Date.now(),
      };

      await setDoc(
        doc(db, 'documents', id),
        updateData,
        { merge: true }
      );
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));
