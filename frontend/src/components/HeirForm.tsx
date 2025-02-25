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
import type { Heir } from 'utils/estateStore';

const heirSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  relationship: z.enum(['child', 'spouse', 'parent', 'sibling', 'other'], {
    required_error: 'Velg relasjon til avdøde',
  }),
  dateOfBirth: z.string().optional(),
  nationalId: z
    .string()
    .min(11, 'Fødselsnummer må være 11 siffer')
    .max(11, 'Fødselsnummer må være 11 siffer')
    .optional(),
  email: z.string().email('Ugyldig e-postadresse').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Gateadresse er påkrevd'),
    postalCode: z.string().min(4, 'Postnummer må være 4 siffer').max(4),
    city: z.string().min(1, 'Poststed er påkrevd'),
    country: z.string().min(1, 'Land er påkrevd'),
  }).optional(),
});

type FormData = z.infer<typeof heirSchema>;

const relationshipLabels: Record<Heir['relationship'], string> = {
  child: 'Barn',
  spouse: 'Ektefelle/Partner',
  parent: 'Forelder',
  sibling: 'Søsken',
  other: 'Annen',
};

interface Props {
  initialData?: Heir;
  onSave: (data: Heir) => void;
  onCancel: () => void;
}

export function HeirForm({ initialData, onSave, onCancel }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(heirSchema),
    defaultValues: {
      name: initialData?.name || '',
      relationship: initialData?.relationship || 'child',
      dateOfBirth: initialData?.dateOfBirth || '',
      nationalId: initialData?.nationalId || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || {
        street: '',
        postalCode: '',
        city: '',
        country: 'Norge',
      },
    },
  });

  const onSubmit = (data: FormData) => {
    onSave(data as Heir);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relasjon til avdøde</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg relasjon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(relationshipLabels).map(([value, label]) => (
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
        </div>

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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-post</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ola.nordmann@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="+47 123 45 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adresse</h3>

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
