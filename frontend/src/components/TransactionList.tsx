import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, FileText, CheckCircle2, ThumbsUp, ThumbsDown, Edit, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useTransactionStore, type Transaction, type CancellationRequest } from 'utils/transactionStore';

interface Props {
  estateId: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('nb-NO');
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK',
  }).format(amount);
}

function formatCategory(category: string) {
  const categories: Record<string, string> = {
    'streaming': 'Streaming',
    'telecom': 'Telekom',
    'utilities': 'Strøm og vann',
    'groceries': 'Dagligvarer',
    'transport': 'Transport',
    'other': 'Annet',
  };
  return categories[category] || category;
}

function TransactionFeedbackDialog({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubscription, setIsSubscription] = useState(transaction.is_subscription);
  const [category, setCategory] = useState(transaction.category);
  const [frequency, setFrequency] = useState(transaction.subscription_frequency || 'monthly');
  const { correctTransaction } = useTransactionStore();

  const handleSubmit = () => {
    correctTransaction(transaction.id, {
      is_subscription: isSubscription,
      category,
      subscription_frequency: isSubscription ? frequency : undefined,
    });
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Korriger
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Korriger transaksjonsdetaljer</DialogTitle>
          <DialogDescription>
            Hjelp oss å forbedre vår AI ved å korrigere transaksjonsdetaljer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Er dette et abonnement?</Label>
            <div className="flex gap-4">
              <Button
                variant={isSubscription ? 'default' : 'outline'}
                onClick={() => setIsSubscription(true)}
              >
                Ja
              </Button>
              <Button
                variant={!isSubscription ? 'default' : 'outline'}
                onClick={() => setIsSubscription(false)}
              >
                Nei
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="streaming">Streaming</SelectItem>
                <SelectItem value="telecom">Telekom</SelectItem>
                <SelectItem value="utilities">Strøm og vann</SelectItem>
                <SelectItem value="groceries">Dagligvarer</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="other">Annet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSubscription && (
            <div className="space-y-2">
              <Label>Frekvens</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Ukentlig</SelectItem>
                  <SelectItem value="monthly">Månedlig</SelectItem>
                  <SelectItem value="quarterly">Kvartalsvis</SelectItem>
                  <SelectItem value="yearly">Årlig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
          >
            Lagre korrigeringer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CancellationDialog({
  transaction,
  estateId,
  onSuccess,
}: {
  transaction: Transaction;
  estateId: string;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'email' | 'letter'>('email');
  const [email, setEmail] = useState('');
  const { cancelSubscription, loadCancellationStatus, updateCancellationStatus } = useTransactionStore();

  // Load cancellation status when dialog opens
  useEffect(() => {
    if (open) {
      loadCancellationStatus(estateId, transaction.id);
    }
  }, [open, estateId, transaction.id, loadCancellationStatus]);

  // Get cancellation status from transaction
  const status = transaction.cancellation_status || null;

  const handleCancel = async () => {
    setLoading(true);
    try {
      const request: CancellationRequest = {
        transaction_id: transaction.id,
        estate_id: estateId,
        cancellation_method: method,
        contact_info: {
          email: email,
        },
      };

      const response = await cancelSubscription(request);

      if (method === 'email' && response.cancellation_email) {
        // Copy email content to clipboard
        await navigator.clipboard.writeText(response.cancellation_email);
        toast.success('Oppsigelsestekst kopiert til utklippstavlen');
      } else if (method === 'letter' && response.cancellation_letter) {
        // Copy letter content to clipboard
        await navigator.clipboard.writeText(response.cancellation_letter);
        toast.success('Brevtekst kopiert til utklippstavlen');
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Cancellation failed:', error);
      toast.error('Kunne ikke generere oppsigelse');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Venter på bekreftelse';
      case 'confirmed':
        return 'Oppsigelse bekreftet';
      case 'failed':
        return 'Oppsigelse feilet';
      default:
        return 'Ukjent status';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={status?.status === 'confirmed'}
          onClick={() => {
            if (status?.status === 'pending') {
              updateCancellationStatus(estateId, transaction.id, {
                status: 'confirmed',
                comment: 'Oppsigelse bekreftet av bruker',
              });
            }
          }}
        >
          {status ? (
            <>
              {getStatusIcon(status.status)}
              {getStatusText(status.status)}
            </>
          ) : (
            <>Si opp</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Si opp abonnement</DialogTitle>
          <DialogDescription>
            Velg hvordan du vil si opp abonnementet hos {transaction.recipient}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {status ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(status.status)}
                <span className="font-medium">{getStatusText(status.status)}</span>
              </div>

              <div className="space-y-2">
                <Label>Historikk</Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {status.history.map((entry, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {getStatusIcon(entry.status)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getStatusText(entry.status)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {new Date(entry.timestamp).toLocaleString('nb-NO')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {entry.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                <Button
                  variant={method === 'email' ? 'default' : 'outline'}
                  onClick={() => setMethod('email')}
                  className="flex-1 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  E-post
                </Button>
                <Button
                  variant={method === 'letter' ? 'default' : 'outline'}
                  onClick={() => setMethod('letter')}
                  className="flex-1 flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Brev
                </Button>
              </div>

              {method === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="email">E-postadresse for oppsigelse</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kunde@eksempel.no"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              )}

              <Button
                onClick={handleCancel}
                disabled={loading || (method === 'email' && !email)}
                className="w-full flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Genererer oppsigelse...
                  </>
                ) : (
                  <>Generer oppsigelse</>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TransactionList({ estateId }: Props) {
  const { transactions, loading, loadTransactions } = useTransactionStore();

  useEffect(() => {
    loadTransactions(estateId);
  }, [estateId, loadTransactions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const subscriptions = transactions.filter(t => t.is_subscription);
  const otherTransactions = transactions.filter(t => !t.is_subscription);

  return (
    <div className="space-y-8">
      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Aktive abonnementer</CardTitle>
          <CardDescription>
            Abonnementer som kan sies opp på vegne av dødsboet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Ingen aktive abonnementer funnet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Dato</TableHead>
                    <TableHead className="whitespace-nowrap">Mottaker</TableHead>
                    <TableHead className="whitespace-nowrap">Beløp</TableHead>
                    <TableHead className="whitespace-nowrap">Kategori</TableHead>
                    <TableHead className="whitespace-nowrap">Handling</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.recipient}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatAmount(transaction.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCategory(transaction.category)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          {!transaction.user_confirmed && (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmTransaction(transaction.id, true)}
                                className="text-green-600"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmTransaction(transaction.id, false)}
                                className="text-red-600"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <TransactionFeedbackDialog
                            transaction={transaction}
                            onClose={() => {}}
                          />
                          <CancellationDialog
                            transaction={transaction}
                            estateId={estateId}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Øvrige transaksjoner</CardTitle>
          <CardDescription>
            Andre transaksjoner som ikke er abonnementer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {otherTransactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Ingen transaksjoner funnet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Dato</TableHead>
                    <TableHead className="whitespace-nowrap">Mottaker</TableHead>
                    <TableHead className="whitespace-nowrap">Beløp</TableHead>
                    <TableHead className="whitespace-nowrap">Kategori</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="whitespace-nowrap">{transaction.recipient}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatAmount(transaction.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCategory(transaction.category)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
