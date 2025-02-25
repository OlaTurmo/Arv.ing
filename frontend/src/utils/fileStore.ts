import { create } from 'zustand';
import { db, storage } from './firebase';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  type DocumentData
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import type { User } from 'firebase/auth';

export interface FileMetadata {
  id: string;
  userId: string;
  estateId?: string;
  filename: string;
  fileType: string;
  size: number;
  downloadUrl: string;
  storagePath: string;
  category: 'document' | 'image' | 'other';
  description?: string;
  createdAt: number;
  updatedAt: number;
}

interface FileUploadProgress {
  id: string;
  progress: number;
  error?: string;
}

interface FileStore {
  files: FileMetadata[];
  uploadProgress: Record<string, FileUploadProgress>;
  isLoading: boolean;
  error: Error | null;
  // Initialize listener
  subscribeToFiles: (user: User, estateId?: string) => () => void;
  // Upload file
  uploadFile: (file: File, userId: string, estateId?: string, description?: string) => Promise<string>;
  // Delete file
  deleteFile: (fileId: string) => Promise<void>;
  // Update file metadata
  updateFileMetadata: (fileId: string, data: Partial<Omit<FileMetadata, 'id' | 'userId' | 'downloadUrl' | 'storagePath'>>) => Promise<void>;
}

const getFileCategory = (fileType: string): FileMetadata['category'] => {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType === 'application/pdf') return 'document';
  return 'other';
};

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  uploadProgress: {},
  isLoading: true,
  error: null,

  subscribeToFiles: (user: User, estateId?: string) => {
    // Test data
    const testFiles: FileMetadata[] = [
      {
        id: 'file_1',
        userId: user.uid,
        estateId: 'estate_1',
        filename: 'Skifteattest.pdf',
        fileType: 'application/pdf',
        size: 1024 * 1024 * 2, // 2MB
        downloadUrl: 'https://example.com/skifteattest.pdf',
        storagePath: 'files/test-user/file_1-Skifteattest.pdf',
        category: 'document',
        description: 'Skifteattest for Ole Hansen',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3  // 3 days ago
      },
      {
        id: 'file_2',
        userId: user.uid,
        estateId: 'estate_1',
        filename: 'Fullmakt.pdf',
        fileType: 'application/pdf',
        size: 1024 * 1024 * 1, // 1MB
        downloadUrl: 'https://example.com/fullmakt.pdf',
        storagePath: 'files/test-user/file_2-Fullmakt.pdf',
        category: 'document',
        description: 'Fullmakt fra Kari Hansen',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2  // 2 days ago
      },
      {
        id: 'file_3',
        userId: user.uid,
        estateId: 'estate_1',
        filename: 'Bankutskrift.pdf',
        fileType: 'application/pdf',
        size: 1024 * 1024 * 3, // 3MB
        downloadUrl: 'https://example.com/bankutskrift.pdf',
        storagePath: 'files/test-user/file_3-Bankutskrift.pdf',
        category: 'document',
        description: 'Bankutskrift for siste 12 måneder',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1  // 1 day ago
      }
    ];

    // Filter by estateId if provided
    const files = estateId
      ? testFiles.filter(file => file.estateId === estateId)
      : testFiles;

    // Set files and loading state
    set({ files, isLoading: false });

    // Return empty unsubscribe function
    return () => {};
  },

  uploadFile: async (file: File, userId: string, estateId?: string, description?: string) => {
    try {
      // Create a unique file ID
      const fileId = doc(collection(db, 'files')).id;
      
      // Create a reference to the storage location
      const storagePath = `files/${userId}/${fileId}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      // Initialize progress tracking
      set(state => ({
        uploadProgress: {
          ...state.uploadProgress,
          [fileId]: { id: fileId, progress: 0 }
        }
      }));

      // Start upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          set(state => ({
            uploadProgress: {
              ...state.uploadProgress,
              [fileId]: { id: fileId, progress }
            }
          }));
        },
        (error) => {
          set(state => ({
            uploadProgress: {
              ...state.uploadProgress,
              [fileId]: { id: fileId, progress: 0, error: error.message }
            }
          }));
          throw error;
        }
      );

      // Wait for upload to complete
      await uploadTask;

      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);

      // Create file metadata in Firestore
      const metadata: FileMetadata = {
        id: fileId,
        userId,
        estateId,
        filename: file.name,
        fileType: file.type,
        size: file.size,
        downloadUrl,
        storagePath,
        category: getFileCategory(file.type),
        description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(doc(db, 'files', fileId), metadata);

      // Clear progress
      set(state => {
        const { [fileId]: _, ...rest } = state.uploadProgress;
        return { uploadProgress: rest };
      });

      return fileId;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      const file = get().files.find(f => f.id === fileId);
      if (!file) return;

      // Delete from Storage
      const storageRef = ref(storage, file.storagePath);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, 'files', fileId));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  updateFileMetadata: async (fileId: string, data: Partial<Omit<FileMetadata, 'id' | 'userId' | 'downloadUrl' | 'storagePath'>>) => {
    try {
      const updateData = {
        ...data,
        updatedAt: Date.now(),
      };

      await setDoc(
        doc(db, 'files', fileId),
        updateData,
        { merge: true }
      );
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },
}));
