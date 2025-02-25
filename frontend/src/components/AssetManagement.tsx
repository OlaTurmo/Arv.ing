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
import { AssetForm } from './AssetForm';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import type { Asset } from 'utils/estateStore';

const assetTypeLabels: Record<Asset['type'], string> = {
  real_estate: 'Eiendom',
  vehicle: 'Kjøretøy',
  bank_account: 'Bankkonto',
  securities: 'Verdipapirer',
  other: 'Annet',
};

interface Props {
  assets: Asset[];
  onSave: (assets: Asset[]) => void;
  onBack?: () => void;
  onNext?: () => void;
}

interface AssetsByType {
  type: Asset['type'];
  label: string;
  assets: Asset[];
  total: number;
}

export function AssetManagement({ assets, onSave, onBack, onNext }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();

  const assetsByType = useMemo(() => {
    const types = Object.entries(assetTypeLabels).map(([type, label]) => ({
      type: type as Asset['type'],
      label,
      assets: assets.filter(asset => asset.type === type),
      total: assets
        .filter(asset => asset.type === type)
        .reduce((sum, asset) => sum + asset.estimatedValue, 0),
    }));

    // Sort by total value, descending
    return types.sort((a, b) => b.total - a.total);
  }, [assets]);

  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.estimatedValue, 0);
  }, [assets]);

  const handleAddAsset = (asset: Asset) => {
    onSave([...assets, asset]);
    setIsDialogOpen(false);
  };

  const handleEditAsset = (asset: Asset) => {
    const updatedAssets = assets.map(a =>
      a.id === selectedAsset?.id ? asset : a
    );
    onSave(updatedAssets);
    setIsDialogOpen(false);
    setSelectedAsset(undefined);
  };

  const handleDeleteAsset = (asset: Asset) => {
    const updatedAssets = assets.filter(a => a.id !== asset.id);
    onSave(updatedAssets);
  };

  const openEditDialog = (asset: Asset) => {
    setSelectedAsset(asset);
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
          <h2 className="text-lg font-medium">Eiendeler</h2>
          <p className="text-sm text-muted-foreground">
            Total verdi: {formatCurrency(totalValue)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedAsset(undefined)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Legg til eiendel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAsset ? 'Rediger eiendel' : 'Legg til eiendel'}
              </DialogTitle>
              <DialogDescription>
                Fyll ut informasjon om eiendelen.
              </DialogDescription>
            </DialogHeader>
            <AssetForm
              initialData={selectedAsset}
              onSave={selectedAsset ? handleEditAsset : handleAddAsset}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {assetsByType.map(({ type, label, assets: typeAssets, total }) => (
          typeAssets.length > 0 && (
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
                {typeAssets.map(asset => (
                  <div
                    key={asset.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{asset.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(asset.estimatedValue)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(asset)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAsset(asset)}
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

        {assets.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Ingen eiendeler er lagt til ennå.
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
