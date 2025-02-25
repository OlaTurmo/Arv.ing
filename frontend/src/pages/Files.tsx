import React, { useEffect, useState } from 'react';
import { Layout } from 'components/Layout';
import { useUserGuardContext } from 'app';
import { useFileStore, type FileMetadata } from 'utils/fileStore';
import { FileUpload } from 'components/FileUpload';
import { FilePreview } from 'components/FilePreview';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Files() {
  const { user } = useUserGuardContext();
  const { files, isLoading, subscribeToFiles, updateFileMetadata, deleteFile } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [previewFile, setPreviewFile] = useState<FileMetadata | null>(null);
  const [filter, setFilter] = useState<'all' | 'document' | 'image' | 'other'>('all');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToFiles(user);
    return () => unsubscribe();
  }, [user, subscribeToFiles]);

  const filteredFiles = files
    .filter(file => {
      if (filter !== 'all' && file.category !== filter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          file.filename.toLowerCase().includes(searchLower) ||
          file.description?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleUpdateDescription = async () => {
    if (!selectedFile) return;
    try {
      await updateFileMetadata(selectedFile.id, { description: editDescription });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update description:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne filen?')) return;
    try {
      await deleteFile(fileId);
      if (selectedFile?.id === fileId) setSelectedFile(null);
      if (previewFile?.id === fileId) setPreviewFile(null);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Filer</h1>
            <FileUpload />
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Files List */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Søk i filer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={filter}
                  onValueChange={(value: typeof filter) => setFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle filer</SelectItem>
                    <SelectItem value="document">Dokumenter</SelectItem>
                    <SelectItem value="image">Bilder</SelectItem>
                    <SelectItem value="other">Andre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File List */}
              <div className="space-y-4">
                {filteredFiles.map((file) => (
                  <Card
                    key={file.id}
                    className={`p-4 cursor-pointer transition-colors
                      ${selectedFile?.id === file.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold truncate">{file.filename}</h3>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB •{' '}
                          {new Date(file.createdAt).toLocaleDateString('nb-NO')}
                        </p>
                        {file.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewFile(file);
                          }}
                        >
                          Forhåndsvis
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                        >
                          Slett
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredFiles.length === 0 && (
                  <Card className="p-6 text-center text-gray-500">
                    {search || filter !== 'all'
                      ? 'Ingen filer matcher søket'
                      : 'Ingen filer. Klikk "Last opp fil" for å komme i gang.'}
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* File Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detaljer</h2>
            {selectedFile ? (
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Filnavn</Label>
                    <p className="font-medium break-all">{selectedFile.filename}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Type</Label>
                    <p className="font-medium">{selectedFile.fileType}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Størrelse</Label>
                    <p className="font-medium">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-gray-500">Beskrivelse</Label>
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditing(true);
                            setEditDescription(selectedFile.description || '');
                          }}
                        >
                          Rediger
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Legg til en beskrivelse"
                          rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(false)}
                          >
                            Avbryt
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleUpdateDescription}
                          >
                            Lagre
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">
                        {selectedFile.description || 'Ingen beskrivelse'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Lastet opp</Label>
                    <p className="font-medium">
                      {new Date(selectedFile.createdAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Sist endret</Label>
                    <p className="font-medium">
                      {new Date(selectedFile.updatedAt).toLocaleDateString('nb-NO')}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setPreviewFile(selectedFile)}
                    >
                      Forhåndsvis
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteFile(selectedFile.id)}
                    >
                      Slett fil
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-gray-500">
                Velg en fil for å se detaljer
              </Card>
            )}
          </div>
        </div>

          {/* File Preview Dialog */}
          {previewFile && (
            <FilePreview
              file={previewFile}
              open={!!previewFile}
              onOpenChange={(open) => !open && setPreviewFile(null)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
