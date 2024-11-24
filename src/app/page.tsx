'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Part {
  id: number;
  internalPartNumber: string;
  internalDescription: string;
  manufacturerName: string;
  manufacturerPartNumber: string;
}

export default function Home() {
  const [parts, setParts] = useState<Part[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Part | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setParts(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const startEditing = (part: Part) => {
    setEditingId(part.id);
    setEditForm({ ...part });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (field: keyof Part, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const saveChanges = async (id: number) => {
    if (!editForm) return;

    try {
      const response = await fetch(`/api/parts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Update failed');

      const updatedPart = await response.json();
      setParts(parts.map(p => p.id === id ? updatedPart : p));
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating part:', error);
    }
  };

  const deletePart = async (id: number) => {
    try {
      const response = await fetch(`/api/parts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setParts(parts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Parts Database Manager</h1>
      
      <div className="mb-8">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4"
        />
        <Button>Upload CSV</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Internal Part #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manufacturer</TableHead>
              <TableHead>Manufacturer Part #</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((part) => (
              <TableRow key={part.id}>
                {editingId === part.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm?.internalPartNumber || ''}
                        onChange={(e) => handleEditChange('internalPartNumber', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm?.internalDescription || ''}
                        onChange={(e) => handleEditChange('internalDescription', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm?.manufacturerName || ''}
                        onChange={(e) => handleEditChange('manufacturerName', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editForm?.manufacturerPartNumber || ''}
                        onChange={(e) => handleEditChange('manufacturerPartNumber', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => saveChanges(part.id)}>
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{part.internalPartNumber}</TableCell>
                    <TableCell>{part.internalDescription}</TableCell>
                    <TableCell>{part.manufacturerName}</TableCell>
                    <TableCell>{part.manufacturerPartNumber}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => startEditing(part)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deletePart(part.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
