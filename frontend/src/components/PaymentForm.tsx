import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import brain from 'brain';
import { useUserGuardContext } from 'app';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51OZaiLAiI3aTyHA2Ij3zYXHHPGcEfEBTLZLXEVpXHELEVNNHJBRYLFKPBTXPxXEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');

interface Props {
  estateId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PaymentForm({ estateId, onSuccess, onError }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { user } = useUserGuardContext();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(undefined);

      // Create a payment intent
      const response = await brain.create_payment_intent({
        estate_id: estateId,
      });
      const { client_secret, amount } = await response.json();

      // Load Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Could not initialize Stripe');
      }

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements: null,
        clientSecret: client_secret,
        confirmParams: {
          return_url: window.location.href,
          payment_method: 'card',
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess?.();
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betaling for dødsbo</CardTitle>
        <CardDescription>
          Fast pris for håndtering av dødsbo er 3 000 NOK.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Prisen inkluderer:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Komplett håndtering av dødsboet</li>
            <li>Juridisk assistanse</li>
            <li>Automatisk beregning av arveoppgjør</li>
            <li>Digital dokumenthåndtering</li>
          </ul>
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Behandler betaling...' : 'Betal 3 000 NOK'}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Sikker betaling via Stripe
        </div>
      </CardContent>
    </Card>
  );
}
