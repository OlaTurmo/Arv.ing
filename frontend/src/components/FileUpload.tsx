import React, { useCallback, useState } from 'react';
import { useUserGuardContext } from 'app';
import { useFileStore } from 'utils/fileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  estateId?: string;
  trigger?: React.ReactNode;
  onUploadComplete?: () => void;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ estateId, trigger, onUploadComplete }: Props) {
  const { user } = useUserGuardContext();
  const { uploadFile, uploadProgress } = useFileStore();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (fileList: File[]): string | null => {
    for (const file of fileList) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `Ugyldig filtype: ${file.type}. Tillatte filtyper: PDF, JPEG, PNG, GIF, WEBP`;
      }
      if (file.size > MAX_FILE_SIZE) {
        return `Filen ${file.name} er for stor. Maksimal størrelse er 10MB`;
      }
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validationError = validateFiles(droppedFiles);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFiles(droppedFiles);
    setError(null);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const selectedFiles = Array.from(e.target.files);
    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFiles(selectedFiles);
    setError(null);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);
    setError(null);

    try {
      await Promise.all(
        files.map(file =>
          uploadFile(file, user.uid, estateId, description)
        )
      );
      setOpen(false);
      setFiles([]);
      setDescription('');
      onUploadComplete?.();
    } catch (err) {
      setError('Kunne ikke laste opp filen(e). Prøv igjen senere.');
    } finally {
      setIsUploading(false);
    }
  };

  const getUploadProgress = () => {
    if (!files.length) return 0;
    const totalProgress = Object.values(uploadProgress)
      .reduce((sum, { progress }) => sum + progress, 0);
    return totalProgress / files.length;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            Last opp fil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Last opp fil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Drag and drop area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center
              ${error ? 'border-red-500' : 'border-gray-300'}
              transition-colors hover:border-blue-500`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <p>Dra og slipp filer her, eller</p>
              <label className="cursor-pointer">
                <Input
                  type="file"
                  className="hidden"
                  multiple
                  accept={ALLOWED_FILE_TYPES.join(',')}
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                >
                  Velg filer
                </Button>
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Tillatte filtyper: PDF, JPEG, PNG, GIF, WEBP
                <br />
                Maks størrelse: 10MB
              </p>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Valgte filer:</Label>
              <ul className="text-sm space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivelse (valgfritt)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Legg til en beskrivelse av filen(e)"
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <Progress value={getUploadProgress()} />
              <p className="text-sm text-center text-gray-500">
                Laster opp... {Math.round(getUploadProgress())}%
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Avbryt
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpload}
              disabled={!files.length || isUploading}
            >
              {isUploading ? 'Laster opp...' : 'Last opp'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
