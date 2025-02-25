import React, { useEffect } from 'react';
import { Layout } from 'components/Layout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserGuardContext } from 'app';
import { useEstateStore } from 'utils/estateStore';
import { TransactionUpload } from 'components/TransactionUpload';
import { TransactionList } from 'components/TransactionList';

export default function Transactions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUserGuardContext();
  const { estates, loading, loadEstates } = useEstateStore();
  const estateId = searchParams.get('estateId');

  useEffect(() => {
    loadEstates(user.uid);
  }, [user, loadEstates]);

  useEffect(() => {
    if (!loading && estates.length > 0 && !estateId) {
      // Automatically select the first estate if none is selected
      navigate(`/transactions?estateId=${estates[0].id}`);
    }
  }, [loading, estates, estateId, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-36"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!estateId) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground text-lg">
                Ingen dødsbo valgt. Gå tilbake og velg et dødsbo.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto space-y-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Banktransaksjoner og abonnementer
          </h1>
          <p className="text-muted-foreground">
            Last opp kontoutskrifter for å identifisere og si opp abonnementer.
          </p>

          <TransactionUpload estateId={estateId} />
          <TransactionList estateId={estateId} />
        </div>
      </div>
    </Layout>
  );
}
