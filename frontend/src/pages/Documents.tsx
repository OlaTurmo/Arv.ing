import React, { useEffect, useState } from 'react';
import { Layout } from 'components/Layout';
import { useUserGuardContext } from 'app';
import { useDocumentStore, type DocumentTemplate } from 'utils/documentStore';
import { DocumentGenerator } from 'components/DocumentGenerator';
import { DocumentPreview } from 'components/DocumentPreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Documents() {
  const { user } = useUserGuardContext();
  const { documents, isLoading, subscribeToDocuments } = useDocumentStore();
  const [selectedDocument, setSelectedDocument] = useState<DocumentTemplate | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocuments(user);
    return () => unsubscribe();
  }, [user, subscribeToDocuments]);

  if (isLoading) {
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <h1 className="text-2xl font-bold">Dokumenter</h1>
          <DocumentGenerator />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Dine dokumenter</h2>
            <div className="space-y-4">
              {documents.map((document) => (
                <Card
                  key={document.id}
                  className={`p-4 cursor-pointer transition-colors ${selectedDocument?.id === document.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{document.title}</h3>
                      <p className="text-sm text-gray-600">
                        {document.type === 'skifteattest' ? 'Skifteattest' :
                         document.type === 'fullmakt' ? 'Fullmakt' :
                         'Testamente'}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Forhåndsvis
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle>{document.title}</DialogTitle>
                        </DialogHeader>
                        <DocumentPreview document={document} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Opprettet: {new Date(document.createdAt).toLocaleDateString('nb-NO')}
                  </div>
                </Card>
              ))}

              {documents.length === 0 && (
                <Card className="p-6 text-center text-gray-500">
                  Ingen dokumenter. Klikk "Nytt dokument" for å komme i gang.
                </Card>
              )}
            </div>
          </div>

          {/* Document Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detaljer</h2>
            {selectedDocument ? (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{selectedDocument.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Innhold</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedDocument.content).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">
                            {key === 'content' ? 'Innhold' :
                             key === 'scope' ? 'Omfang' :
                             key === 'duration' ? 'Varighet' :
                             key === 'witnesses' ? 'Vitner' :
                             key === 'place' ? 'Sted' :
                             key === 'date' ? 'Dato' :
                             key === 'fullName' ? 'Fullt navn' :
                             key === 'dateOfDeath' ? 'Dødsdato' :
                             key === 'placeOfDeath' ? 'Dødssted' :
                             key === 'lastResidence' ? 'Siste bosted' :
                             key === 'nextOfKin' ? 'Nærmeste pårørende' :
                             key === 'relationship' ? 'Relasjon' :
                             key === 'grantor' ? 'Fullmaktsgiver' :
                             key === 'grantorAddress' ? 'Fullmaktsgivers adresse' :
                             key === 'attorney' ? 'Fullmektig' :
                             key === 'attorneyAddress' ? 'Fullmektigs adresse' :
                             key === 'testator' ? 'Testator' :
                             key === 'dateOfBirth' ? 'Fødselsdato' :
                             key === 'address' ? 'Adresse' :
                             key}:
                          </span>
                          <p className="whitespace-pre-wrap">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Opprettet</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedDocument.createdAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Sist oppdatert</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedDocument.updatedAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Velg et dokument for å se detaljer
              </Card>
            )}
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
