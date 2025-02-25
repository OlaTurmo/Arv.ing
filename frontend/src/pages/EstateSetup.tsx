import React, { useState, useEffect } from 'react';
import { Layout } from 'components/Layout';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DeceasedForm } from 'components/DeceasedForm';
import { HeirManagement } from 'components/HeirManagement';
import { AssetManagement } from 'components/AssetManagement';
import { DebtManagement } from 'components/DebtManagement';
import { EstateSummary } from 'components/EstateSummary';
import { PaymentForm } from 'components/PaymentForm';
import type { Person, Estate } from 'utils/estateStore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserGuardContext } from 'app';
import { useEstateStore } from 'utils/estateStore';

const steps = [
  'Avdøde',
  'Arvinger',
  'Eiendeler',
  'Gjeld',
  'Oppsummering',
  'Betaling'
];

export default function EstateSetup() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const { createEstate, updateEstate, currentEstate, setCurrentEstate } = useEstateStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [localEstate, setLocalEstate] = useState<Estate>(() => {
    // Initialize estate with default values
    return {
      id: '',
      userId: user.uid,
      status: 'draft',
      currentStep: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deceased: {
        name: '',
        address: {
          street: '',
          postalCode: '',
          city: '',
          country: 'Norge',
        },
      },
      heirs: [],
      assets: [],
      debts: [],
      estateName: 'Nytt arveoppgjør',
      deceasedName: '',
      progress: 0,
      tasks: [],
    };
  });

  // Initialize estate on first render
  useEffect(() => {
    const initializeEstate = async () => {
      if (!currentEstate) {
        try {
          setLoading(true);
          const newEstate = await createEstate(user.uid);
          setCurrentEstate(newEstate);
        } catch (error) {
          console.error('Failed to create estate:', error);
          toast.error('Kunne ikke opprette dødsbo');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeEstate();
  }, []);

  const handleSaveDeceased = async (data: Person) => {
    if (!currentEstate) return;

    setLoading(true);
    try {
      await updateEstate(currentEstate.id, {
        deceased: data,
        currentStep: currentStep + 1,
      });
      setLocalEstate(prev => ({
        ...prev,
        deceased: data,
      }));
      handleNext();
    } catch (error) {
      console.error('Failed to save deceased information:', error);
      toast.error('Kunne ikke lagre informasjon om avdøde');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeirs = async (heirs: Person[]) => {
    if (!currentEstate) return;

    setLoading(true);
    try {
      await updateEstate(currentEstate.id, {
        heirs,
      });
      setLocalEstate(prev => ({
        ...prev,
        heirs,
      }));
    } catch (error) {
      console.error('Failed to save heirs:', error);
      toast.error('Kunne ikke lagre arvinger');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssets = async (assets: Asset[]) => {
    if (!currentEstate) return;

    setLoading(true);
    try {
      await updateEstate(currentEstate.id, {
        assets,
      });
      setLocalEstate(prev => ({
        ...prev,
        assets,
      }));
    } catch (error) {
      console.error('Failed to save assets:', error);
      toast.error('Kunne ikke lagre eiendeler');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDebts = async (debts: Debt[]) => {
    if (!currentEstate) return;

    setLoading(true);
    try {
      await updateEstate(currentEstate.id, {
        debts,
      });
      setLocalEstate(prev => ({
        ...prev,
        debts,
      }));
    } catch (error) {
      console.error('Failed to save debts:', error);
      toast.error('Kunne ikke lagre gjeld');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!currentEstate) return;

    setLoading(true);
    try {
      await updateEstate(currentEstate.id, {
        currentStep: currentStep + 1,
      });
      handleNext();
    } catch (error) {
      console.error('Failed to update step:', error);
      toast.error('Kunne ikke oppdatere steg');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    navigate('/Dashboard');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container max-w-3xl">
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center items-center">
              <p className="text-muted-foreground">
                Laster inn dødsbo...
              </p>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentEstate) {
    return (
      <div className="container max-w-3xl py-8">
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center items-center">
              <p className="text-muted-foreground">
                Kunne ikke laste inn dødsbo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Opprett nytt dødsbo</CardTitle>
          <CardDescription>
            Følg stegene under for å registrere informasjon om dødsboet.
            Du kan lagre fremgangen underveis og fortsette senere.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="hidden sm:flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 text-center ${index === currentStep ? 'text-primary font-medium' : 'text-gray-500'}`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 ${index <= currentStep ? 'bg-primary' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="min-h-[400px] px-2 sm:px-4">
            {currentStep === 0 && (
              <DeceasedForm
                initialData={currentEstate?.deceased || localEstate.deceased}
                onSave={handleSaveDeceased}
              />
            )}
            {currentStep === 1 && (
              <HeirManagement
                heirs={currentEstate?.heirs || localEstate.heirs || []}
                onSave={handleSaveHeirs}
                onBack={handleBack}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <AssetManagement
                assets={currentEstate?.assets || localEstate.assets || []}
                onSave={handleSaveAssets}
                onBack={handleBack}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 3 && (
              <DebtManagement
                debts={currentEstate?.debts || localEstate.debts || []}
                onSave={handleSaveDebts}
                onBack={handleBack}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 4 && currentEstate && (
              <EstateSummary
                estate={currentEstate}
                onBack={handleBack}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 5 && currentEstate && (
              <PaymentForm
                estateId={currentEstate.id}
                onBack={handleBack}
                onSuccess={() => navigate('/Dashboard')}
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Avbryt
            </Button>
          </div>
          <div className="w-full sm:w-auto flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              Tilbake
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 || loading}
            >
              Neste
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
