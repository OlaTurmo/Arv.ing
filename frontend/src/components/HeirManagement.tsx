import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HeirForm } from './HeirForm';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { Heir } from 'utils/estateStore';

const relationshipLabels: Record<Heir['relationship'], string> = {
  child: 'Barn',
  spouse: 'Ektefelle/Partner',
  parent: 'Forelder',
  sibling: 'Søsken',
  other: 'Annen',
};

interface Props {
  heirs: Heir[];
  onSave: (heirs: Heir[]) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export function HeirManagement({ heirs, onSave, onBack, onNext }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHeir, setSelectedHeir] = useState<Heir | undefined>();

  const handleAddHeir = (heir: Heir) => {
    onSave([...heirs, heir]);
    setIsDialogOpen(false);
  };

  const handleEditHeir = (heir: Heir) => {
    const updatedHeirs = heirs.map(h =>
      h.nationalId === selectedHeir?.nationalId ? heir : h
    );
    onSave(updatedHeirs);
    setIsDialogOpen(false);
    setSelectedHeir(undefined);
  };

  const handleDeleteHeir = (heir: Heir) => {
    const updatedHeirs = heirs.filter(h => h.nationalId !== heir.nationalId);
    onSave(updatedHeirs);
  };

  const openEditDialog = (heir: Heir) => {
    setSelectedHeir(heir);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Arvinger</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedHeir(undefined)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Legg til arving
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedHeir ? 'Rediger arving' : 'Legg til arving'}
              </DialogTitle>
              <DialogDescription>
                Fyll ut informasjon om arvingen.
              </DialogDescription>
            </DialogHeader>
            <HeirForm
              initialData={selectedHeir}
              onSave={selectedHeir ? handleEditHeir : handleAddHeir}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {heirs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Ingen arvinger er lagt til ennå.
            </CardContent>
          </Card>
        ) : (
          heirs.map((heir, index) => (
            <Card key={heir.nationalId || index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{heir.name}</CardTitle>
                    <CardDescription>
                      {relationshipLabels[heir.relationship]}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(heir)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHeir(heir)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {heir.dateOfBirth && (
                    <div>
                      <span className="text-muted-foreground">Fødselsdato: </span>
                      {heir.dateOfBirth}
                    </div>
                  )}
                  {heir.nationalId && (
                    <div>
                      <span className="text-muted-foreground">Fødselsnummer: </span>
                      {heir.nationalId}
                    </div>
                  )}
                  {heir.email && (
                    <div>
                      <span className="text-muted-foreground">E-post: </span>
                      {heir.email}
                    </div>
                  )}
                  {heir.phone && (
                    <div>
                      <span className="text-muted-foreground">Telefon: </span>
                      {heir.phone}
                    </div>
                  )}
                </div>
                {heir.address && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Adresse: </span>
                    {heir.address.street}, {heir.address.postalCode} {heir.address.city}
                    {heir.address.country !== 'Norge' && `, ${heir.address.country}`}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Tilbake
          </Button>
        )}
        {onNext && (
          <Button
            onClick={onNext}
            className={onBack ? '' : 'ml-auto'}
          >
            Neste
          </Button>
        )}
      </div>
    </div>
  );
}
