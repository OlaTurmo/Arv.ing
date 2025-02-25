import React from 'react';
import { useUserGuardContext } from 'app';
import { useEstateStore } from 'utils/estateStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Props {
  trigger?: React.ReactNode;
}

const defaultTasks = [
  { id: '1', title: 'Innhent dødsattest', completed: false },
  { id: '2', title: 'Kartlegg eiendeler og gjeld', completed: false },
  { id: '3', title: 'Innhent skifteattest', completed: false },
  { id: '4', title: 'Varsle arvinger', completed: false },
  { id: '5', title: 'Utarbeid arveoppgjør', completed: false },
];

export function NewEstateDialog({ trigger }: Props) {
  const { user } = useUserGuardContext();
  const { createEstate, updateEstate } = useEstateStore();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [estateName, setEstateName] = React.useState('');
  const [deceasedName, setDeceasedName] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estateName || !deceasedName) return;

    setIsSubmitting(true);
    try {
      const estate = await createEstate(user.uid);
      await updateEstate(estate.id, {
        deceased: {
          name: deceasedName,
        },
        estateName,
        tasks: defaultTasks,
      });
      setOpen(false);
      setEstateName('');
      setDeceasedName('');
    } catch (error) {
      console.error('Failed to create estate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Nytt arveoppgjør
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Opprett nytt arveoppgjør</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="estateName">Navn på arveoppgjør</Label>
            <Input
              id="estateName"
              value={estateName}
              onChange={(e) => setEstateName(e.target.value)}
              placeholder="F.eks. 'Arv etter Ola Nordmann'"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deceasedName">Navn på avdøde</Label>
            <Input
              id="deceasedName"
              value={deceasedName}
              onChange={(e) => setDeceasedName(e.target.value)}
              placeholder="Fullt navn på avdøde"
              required
            />
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
