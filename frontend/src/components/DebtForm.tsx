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
import type { Debt } from 'utils/estateStore';

const debtSchema = z.object({
  type: z.enum(['mortgage', 'personal_loan', 'credit_card', 'other'], {
    required_error: 'Velg type gjeld',
  }),
  creditor: z.string().min(1, 'Kreditor er påkrevd'),
  amount: z.string().min(1, 'Beløp er påkrevd').transform(val => {
    // Remove spaces and replace , with .
    const normalized = val.replace(/\s/g, '').replace(',', '.');
    return parseFloat(normalized);
  }),
  metadata: z.record(z.string()).optional(),
});

type FormData = z.infer<typeof debtSchema>;

const debtTypeLabels: Record<Debt['type'], string> = {
  mortgage: 'Boliglån',
  personal_loan: 'Forbrukslån',
  credit_card: 'Kredittkort',
  other: 'Annet',
};

interface Props {
  initialData?: Debt;
  onSave: (data: Debt) => void;
  onCancel: () => void;
}

export function DebtForm({ initialData, onSave, onCancel }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      type: initialData?.type || 'other',
      creditor: initialData?.creditor || '',
      amount: initialData?.amount?.toString() || '',
      metadata: initialData?.metadata || {},
    },
  });

  const onSubmit = (data: FormData) => {
    const debt: Debt = {
      id: initialData?.id || crypto.randomUUID(),
      ...data,
      documents: initialData?.documents || [],
    };
    onSave(debt);
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
                    <SelectValue placeholder="Velg type gjeld" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(debtTypeLabels).map(([value, label]) => (
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
          name="creditor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kreditor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Navn på bank eller kreditor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Beløp (NOK)</FormLabel>
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
                Utstående beløp
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
