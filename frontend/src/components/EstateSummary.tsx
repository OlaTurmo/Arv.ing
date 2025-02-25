import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Receipt, User, Home, CreditCard } from 'lucide-react';
import type { Estate } from 'utils/estateStore';

interface Props {
  estate: Estate;
  onBack?: () => void;
  onNext?: () => void;
}

export function EstateSummary({ estate, onBack, onNext }: Props) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('nb-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const totalAssets = estate.assets?.reduce((sum, asset) => sum + asset.estimatedValue, 0) ?? 0;
  const totalDebts = estate.debts?.reduce((sum, debt) => sum + debt.amount, 0) ?? 0;
  const netWorth = totalAssets - totalDebts;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Oppsummering av dødsbo</CardTitle>
          <CardDescription>
            Gjennomgå informasjonen før du går videre til betaling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deceased Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium">
              <User className="h-5 w-5" />
              <h3>Avdøde</h3>
            </div>
            <div className="pl-7 space-y-1 text-sm">
              {estate.deceased ? (
                <>
                  <p>{estate.deceased.name}</p>
                  {estate.deceased.address && (
                    <>
                      <p>{estate.deceased.address.street}</p>
                      <p>
                        {estate.deceased.address.postalCode} {estate.deceased.address.city}
                      </p>
                      <p>{estate.deceased.address.country}</p>
                    </>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Ingen informasjon registrert</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Heirs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium">
              <User className="h-5 w-5" />
              <h3>Arvinger ({estate.heirs?.length ?? 0})</h3>
            </div>
            <div className="pl-7 space-y-2">
              {estate.heirs?.map((heir, index) => (
                <div key={heir.id} className="text-sm">
                  <p className="font-medium">{heir.name}</p>
                  <p className="text-muted-foreground">{heir.relationship}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Home className="h-5 w-5" />
              <h3>Eiendeler ({estate.assets?.length ?? 0})</h3>
            </div>
            <div className="pl-7 space-y-2">
              {estate.assets?.map((asset) => (
                <div key={asset.id} className="flex justify-between text-sm">
                  <span>{asset.description}</span>
                  <span className="font-medium">
                    {formatCurrency(asset.estimatedValue)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2">
                <span>Total verdi</span>
                <span>{formatCurrency(totalAssets)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Debts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium">
              <CreditCard className="h-5 w-5" />
              <h3>Gjeld ({estate.debts?.length ?? 0})</h3>
            </div>
            <div className="pl-7 space-y-2">
              {estate.debts?.map((debt) => (
                <div key={debt.id} className="flex justify-between text-sm">
                  <span>{debt.creditor}</span>
                  <span className="font-medium">
                    {formatCurrency(debt.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-medium pt-2">
                <span>Total gjeld</span>
                <span>{formatCurrency(totalDebts)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Net Worth */}
          <div className="pl-7">
            <div className="flex justify-between text-lg font-medium">
              <span>Netto formue</span>
              <span className={netWorth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(netWorth)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

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
            className="flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Gå til betaling
          </Button>
        )}
      </div>
    </div>
  );
}
