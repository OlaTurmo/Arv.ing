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
import type { Person } from 'utils/estateStore';

const personSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  dateOfBirth: z.string().optional(),
  dateOfDeath: z.string().min(1, 'Dødsdato er påkrevd'),
  nationalId: z
    .string()
    .min(11, 'Fødselsnummer må være 11 siffer')
    .max(11, 'Fødselsnummer må være 11 siffer')
    .optional(),
  address: z.object({
    street: z.string().min(1, 'Gateadresse er påkrevd'),
    postalCode: z.string().min(4, 'Postnummer må være 4 siffer').max(4),
    city: z.string().min(1, 'Poststed er påkrevd'),
    country: z.string().min(1, 'Land er påkrevd'),
  }).optional(),
});

type FormData = z.infer<typeof personSchema>;

interface Props {
  initialData?: Person;
  onSave: (data: Person) => void;
  onBack?: () => void;
}

export function DeceasedForm({ initialData, onSave, onBack }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      name: initialData?.name || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      dateOfDeath: initialData?.dateOfDeath || '',
      nationalId: initialData?.nationalId || '',
      address: initialData?.address || {
        street: '',
        postalCode: '',
        city: '',
        country: 'Norge',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Navn</FormLabel>
              <FormControl>
                <Input placeholder="Ola Nordmann" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fødselsdato</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfDeath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dødsdato</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fødselsnummer</FormLabel>
              <FormControl>
                <Input placeholder="12345678901" {...field} />
              </FormControl>
              <FormDescription>
                11 siffer, uten mellomrom
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Siste bostedsadresse</h3>

          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gateadresse</FormLabel>
                <FormControl>
                  <Input placeholder="Storgata 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="0123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poststed</FormLabel>
                  <FormControl>
                    <Input placeholder="Oslo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Land</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button
            type="submit"
            className={onBack ? '' : 'ml-auto'}
          >
            Neste
          </Button>
        </div>
      </form>
    </Form>
  );
}
