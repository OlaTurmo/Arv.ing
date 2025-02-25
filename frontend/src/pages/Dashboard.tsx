import React, { useEffect, useState } from 'react';
import { Layout } from 'components/Layout';
import { useUserGuardContext } from 'app';
import { useEstateStore, type Estate } from 'utils/estateStore';
import { NewEstateDialog } from 'components/NewEstateDialog';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { CollaboratorManagement } from 'components/CollaboratorManagement';
import { CommentSection } from 'components/CommentSection';

export default function Dashboard() {
  const { user } = useUserGuardContext();
  const { estates, loading: isLoading, loadEstates, updateEstate, deleteEstate } = useEstateStore();
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

  useEffect(() => {
    loadEstates(user.uid);
  }, [user, loadEstates]);

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
          <h1 className="text-2xl font-bold">Dine arveoppgjør</h1>
          <NewEstateDialog />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Estates List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Aktive saker</h2>
            <div className="space-y-4">
              {estates.map((estate) => (
                <Card
                  key={estate.id}
                  className={`p-4 cursor-pointer transition-colors ${selectedEstate?.id === estate.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedEstate(estate)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Slett arveoppgjør</AlertDialogTitle>
                          <AlertDialogDescription>
                            Er du sikker på at du vil slette dette arveoppgjøret? Dette kan ikke angres.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={async () => {
                              try {
                                await deleteEstate(estate.id);
                                if (selectedEstate?.id === estate.id) {
                                  setSelectedEstate(null);
                                }
                              } catch (error) {
                                console.error('Failed to delete estate:', error);
                              }
                            }}
                          >
                            Slett
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{estate.estateName}</h3>
                      <p className="text-sm text-gray-600 truncate">{estate.deceasedName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      estate.status === 'completed' ? 'bg-green-100 text-green-800' :
                      estate.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {estate.status === 'completed' ? 'Fullført' :
                       estate.status === 'in_progress' ? 'Pågår' :
                       'Utkast'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Fremdrift</span>
                      <span>{estate.progress}%</span>
                    </div>
                    <Progress value={estate.progress} className="h-2" />
                  </div>
                </Card>
              ))}

              {estates.length === 0 && (
                <Card className="p-6 text-center text-gray-500">
                  Ingen aktive arveoppgjør. Klikk "Nytt arveoppgjør" for å komme i gang.
                </Card>
              )}
            </div>
          </div>

          {/* Estate Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detaljer</h2>
            {selectedEstate ? (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">{selectedEstate.estateName}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Oppgaver</h4>
                    <div className="space-y-2">
                      {selectedEstate.tasks.map((task) => (
                        <div key={task.id} className="flex items-start space-x-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={(checked) => {
                              if (selectedEstate.tasks) {
                                const updatedTasks = selectedEstate.tasks.map(t =>
                                  t.id === task.id ? { ...t, completed: checked as boolean } : t
                                );
                                updateEstate(selectedEstate.id, { tasks: updatedTasks });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <p className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </p>
                            {task.dueDate && (
                              <p className="text-sm text-gray-500">
                                Frist: {new Date(task.dueDate).toLocaleDateString('nb-NO')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedEstate.deadlineDate && (
                    <div>
                      <h4 className="font-medium mb-1">Hovedfrist</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedEstate.deadlineDate).toLocaleDateString('nb-NO')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Velg et arveoppgjør for å se detaljer
              </Card>
            )}
          </div>

          {/* Collaboration Section */}
          {selectedEstate && (
            <div className="lg:col-span-3 space-y-6">
              <h2 className="text-lg font-semibold">Samarbeid</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CollaboratorManagement estateId={selectedEstate.id} />
                <CommentSection estateId={selectedEstate.id} />
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </Layout>
  );
}
