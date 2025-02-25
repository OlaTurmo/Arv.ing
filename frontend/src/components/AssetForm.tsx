import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Asset } from 'utils/estateStore';

const assetSchema = z.object({
  type: z.enum(['real_estate', 'vehicle', 'bank_account', 'securities', 'other'], {
    required_error: 'Velg type eiendel',
  }),
  description: z.string().min(1, 'Beskrivelse er påkrevd'),
  estimatedValue: z.string().min(1, 'Verdi er påkrevd').transform(val => {
    // Remove spaces and replace , with .
    const normalized = val.replace(/\s/g, '').replace(',', '.');
    return parseFloat(normalized);
  }),
  metadata: z.record(z.string()).optional(),
});

type FormData = z.infer<typeof assetSchema>;

const assetTypeLabels: Record<Asset['type'], string> = {
  real_estate: 'Eiendom',
  vehicle: 'Kjøretøy',
  bank_account: 'Bankkonto',
  securities: 'Verdipapirer',
  other: 'Annet',
};

interface Props {
  initialData?: Asset;
  onSave: (data: Asset) => void;
  onCancel: () => void;
}

export function AssetForm({ initialData, onSave, onCancel }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      type: initialData?.type || 'other',
      description: initialData?.description || '',
      estimatedValue: initialData?.estimatedValue?.toString() || '',
      metadata: initialData?.metadata || {},
    },
  });

  const onSubmit = (data: FormData) => {
    const asset: Asset = {
      id: initialData?.id || crypto.randomUUID(),
      ...data,
      documents: initialData?.documents || [],
    };
    onSave(asset);
  };

  const formatValue = (value: string) => {
    // Remove all non-numeric characters except dots and commas
    const cleaned = value.replace(/[^0-9.,]/g, '');
    // Replace comma with dot for decimal
    const normalized = cleaned.replace(',', '.');
    // Parse and format the number
    const number = parseFloat(normalized);
    if (isNaN(number)) return cleaned;
    // Format with thousand separators and two decimal places
    return number.toLocaleString('nb-NO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Velg type eiendel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(assetTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beskrivelse</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Beskriv eiendelen..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedValue"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Verdi (NOK)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const formatted = formatValue(e.target.value);
                    e.target.value = formatted;
                    onChange(e);
                  }}
                  placeholder="0"
                />
              </FormControl>
              <FormDescription>
                Anslått markedsverdi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Avbryt
          </Button>
          <Button type="submit">
            Lagre
          </Button>
        </div>
      </form>
    </Form>
  );
}
