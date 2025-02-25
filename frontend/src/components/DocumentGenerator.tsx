import React, { useState } from 'react';
import { useUserGuardContext } from 'app';
import { useDocumentStore, type DocumentType, defaultTemplates } from 'utils/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
}

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: 'skifteattest', label: 'Skifteattest' },
  { value: 'fullmakt', label: 'Fullmakt' },
  { value: 'testamente', label: 'Testamente' },
];

export function DocumentGenerator({ estateId, trigger }: Props) {
  const { user } = useUserGuardContext();
  const createDocument = useDocumentStore((state) => state.createDocument);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<DocumentType>('skifteattest');
  const [content, setContent] = useState<Record<string, string>>(defaultTemplates.skifteattest);

  const handleTypeChange = (newType: DocumentType) => {
    setType(newType);
    setContent(defaultTemplates[newType]);
  };

  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDocument({
        userId: user.uid,
        estateId,
        type,
        title: `${documentTypes.find(d => d.value === type)?.label} ${new Date().toLocaleDateString('nb-NO')}`,
        content,
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFields = () => {
    return Object.entries(content).map(([key, value]) => (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>
          {key === 'content' ? 'Innhold' :
           key === 'scope' ? 'Omfang' :
           key === 'duration' ? 'Varighet' :
           key === 'witnesses' ? 'Vitner' :
           key === 'place' ? 'Sted' :
           key === 'date' ? 'Dato' :
           key === 'fullName' ? 'Fullt navn' :
           key === 'dateOfDeath' ? 'Dødsdato' :
           key === 'placeOfDeath' ? 'Dødssted' :
           key === 'lastResidence' ? 'Siste bosted' :
           key === 'nextOfKin' ? 'Nærmeste pårørende' :
           key === 'relationship' ? 'Relasjon' :
           key === 'grantor' ? 'Fullmaktsgiver' :
           key === 'grantorAddress' ? 'Fullmaktsgivers adresse' :
           key === 'attorney' ? 'Fullmektig' :
           key === 'attorneyAddress' ? 'Fullmektigs adresse' :
           key === 'testator' ? 'Testator' :
           key === 'dateOfBirth' ? 'Fødselsdato' :
           key === 'address' ? 'Adresse' :
           key}
        </Label>
        {['content', 'scope', 'duration'].includes(key) ? (
          <Textarea
            id={key}
            value={value}
            onChange={(e) => handleContentChange(key, e.target.value)}
            rows={5}
          />
        ) : (
          <Input
            id={key}
            value={value}
            onChange={(e) => handleContentChange(key, e.target.value)}
          />
        )}
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            Nytt dokument
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Opprett nytt dokument</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Dokumenttype</Label>
            <Select
              value={type}
              onValueChange={(value) => handleTypeChange(value as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((docType) => (
                  <SelectItem key={docType.value} value={docType.value}>
                    {docType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {renderFields()}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Oppretter...' : 'Opprett'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
