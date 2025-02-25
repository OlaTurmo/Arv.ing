import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { DebtForm } from './DebtForm';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { Debt } from 'utils/estateStore';

const debtTypeLabels: Record<Debt['type'], string> = {
  mortgage: 'Boliglån',
  personal_loan: 'Forbrukslån',
  credit_card: 'Kredittkort',
  other: 'Annet',
};

interface Props {
  debts: Debt[];
  onSave: (debts: Debt[]) => void;
  onBack?: () => void;
  onNext?: () => void;
}

interface DebtsByType {
  type: Debt['type'];
  label: string;
  debts: Debt[];
  total: number;
}

export function DebtManagement({ debts, onSave, onBack, onNext }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>();

  const debtsByType = useMemo(() => {
    const types = Object.entries(debtTypeLabels).map(([type, label]) => ({
      type: type as Debt['type'],
      label,
      debts: debts.filter(debt => debt.type === type),
      total: debts
        .filter(debt => debt.type === type)
        .reduce((sum, debt) => sum + debt.amount, 0),
    }));

    // Sort by total amount, descending
    return types.sort((a, b) => b.total - a.total);
  }, [debts]);

  const totalDebt = useMemo(() => {
    return debts.reduce((sum, debt) => sum + debt.amount, 0);
  }, [debts]);

  const handleAddDebt = (debt: Debt) => {
    onSave([...debts, debt]);
    setIsDialogOpen(false);
  };

  const handleEditDebt = (debt: Debt) => {
    const updatedDebts = debts.map(d =>
      d.id === selectedDebt?.id ? debt : d
    );
    onSave(updatedDebts);
    setIsDialogOpen(false);
    setSelectedDebt(undefined);
  };

  const handleDeleteDebt = (debt: Debt) => {
    const updatedDebts = debts.filter(d => d.id !== debt.id);
    onSave(updatedDebts);
  };

  const openEditDialog = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Gjeld</h2>
          <p className="text-sm text-muted-foreground">
            Total gjeld: {formatCurrency(totalDebt)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedDebt(undefined)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Legg til gjeld
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDebt ? 'Rediger gjeld' : 'Legg til gjeld'}
              </DialogTitle>
              <DialogDescription>
                Fyll ut informasjon om gjelden.
              </DialogDescription>
            </DialogHeader>
            <DebtForm
              initialData={selectedDebt}
              onSave={selectedDebt ? handleEditDebt : handleAddDebt}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {debtsByType.map(({ type, label, debts: typeDebts, total }) => (
          typeDebts.length > 0 && (
            <Card key={type}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>
                      {formatCurrency(total)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                {typeDebts.map(debt => (
                  <div
                    key={debt.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{debt.creditor}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(debt.amount)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(debt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDebt(debt)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        ))}

        {debts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Ingen gjeld er lagt til ennå.
            </CardContent>
          </Card>
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
