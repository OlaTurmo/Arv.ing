import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Receipt, Loader2 } from 'lucide-react';
import brain from 'brain';

interface Props {
  paymentIntentId: string;
  onDone?: () => void;
}

type PaymentStatus = 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'cancelled' | 'succeeded' | 'failed';

interface PaymentStatusResponse {
  status: PaymentStatus;
  amount: number;
  receipt_url: string | null;
}

export function PaymentStatus({ paymentIntentId, onDone }: Props) {
  const [status, setStatus] = useState<PaymentStatusResponse>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const response = await brain.get_payment_status({
        payment_intent_id: paymentIntentId,
      });
      const data = await response.json();
      setStatus(data);

      // If we're in a final state, stop polling
      if (data.status === 'succeeded' || data.status === 'cancelled' || data.status === 'failed') {
        onDone?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not check payment status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check status immediately
    checkStatus();

    // Poll every 2 seconds until we reach a final state
    const interval = setInterval(() => {
      if (status?.status && ['succeeded', 'cancelled', 'failed'].includes(status.status)) {
        clearInterval(interval);
      } else {
        checkStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentIntentId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Sjekker betalingsstatus...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="text-sm text-red-500">
              {error}
            </div>
            <Button onClick={checkStatus} variant="outline">
              Prøv igjen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const formatStatus = (status: PaymentStatus): string => {
    switch (status) {
      case 'succeeded':
        return 'Betaling gjennomført';
      case 'failed':
        return 'Betaling feilet';
      case 'cancelled':
        return 'Betaling avbrutt';
      case 'processing':
        return 'Behandler betaling';
      case 'requires_payment_method':
        return 'Venter på betalingsmetode';
      case 'requires_confirmation':
        return 'Venter på bekreftelse';
      case 'requires_action':
        return 'Venter på handling';
      case 'requires_capture':
        return 'Venter på fangst';
      default:
        return 'Ukjent status';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betalingsstatus</CardTitle>
        <CardDescription>
          {formatStatus(status.status)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {status.status === 'succeeded' ? (
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            ) : status.status === 'failed' || status.status === 'cancelled' ? (
              <XCircle className="h-8 w-8 text-red-500" />
            ) : (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            <div className="text-lg font-medium">
              {status.amount.toLocaleString('nb-NO', {
                style: 'currency',
                currency: 'NOK',
              })}
            </div>
          </div>

          {status.receipt_url && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(status.receipt_url!, '_blank')}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Åpne kvittering
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
