import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from 'utils/transactionStore';

interface Props {
  estateId: string;
  onSuccess?: () => void;
}

export function TransactionUpload({ estateId, onSuccess }: Props) {
  const { uploadTransactions, loading } = useTransactionStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Check file type
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Ugyldig filformat. Vennligst last opp PNG, JPEG eller PDF.');
        return;
      }

      // Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Filen er for stor. Maksimal størrelse er 10MB.');
        return;
      }

      await uploadTransactions(estateId, file);
      toast.success('Transaksjoner lastet opp');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Kunne ikke laste opp filen');
    }
  }, [estateId, uploadTransactions, onSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: loading,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Last opp banktransaksjoner</CardTitle>
        <CardDescription>
          Last opp kontoutskrift som bilde eller PDF.
          Vi støtter PNG, JPEG og PDF-filer opp til 10MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Behandler fil...</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <Upload className="h-8 w-8" />
              <p>Slipp filen her...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p>Dra og slipp en fil her, eller klikk for å velge</p>
              <p className="text-sm">PNG, JPEG eller PDF (maks 10MB)</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
