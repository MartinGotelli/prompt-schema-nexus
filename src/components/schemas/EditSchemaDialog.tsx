
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Schema, Status } from "@/types";
import { formatJson } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface EditSchemaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schema: Schema | null;
}

const EditSchemaDialog: React.FC<EditSchemaDialogProps> = ({
  isOpen,
  onOpenChange,
  schema
}) => {
  const [editedSchema, setEditedSchema] = useState<{
    name: string;
    version: string;
    definition: string;
    owner: string;
    status: Status;
  }>({
    name: "",
    version: "",
    definition: "{}",
    owner: "",
    status: "unstable"
  });

  useEffect(() => {
    if (schema) {
      setEditedSchema({
        name: schema.name,
        version: schema.version,
        definition: formatJson(schema.definition),
        owner: schema.owner || "",
        status: schema.status
      });
    }
  }, [schema]);

  if (!schema) return null;

  const handleSaveChanges = () => {
    toast.success("Schema updated successfully", {
      description: `Schema ${schema.name} has been updated.`,
    });
    onOpenChange(false);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Edit Schema - ${schema.name}`}
      description="Make changes to this schema."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-name">Schema Name</Label>
            <Input 
              id="edit-name" 
              value={editedSchema.name}
              onChange={(e) => setEditedSchema(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <VersionSelector 
            version={editedSchema.version}
            onChange={(version) => setEditedSchema(prev => ({ ...prev, version }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-owner">Owner</Label>
            <Input 
              id="edit-owner" 
              value={editedSchema.owner}
              onChange={(e) => setEditedSchema(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="AI Member (e.g., Cool AI)" 
            />
          </div>
          <StatusSelector 
            status={editedSchema.status}
            onChange={(status) => setEditedSchema(prev => ({ ...prev, status }))}
          />
        </div>
        <div>
          <Label htmlFor="edit-schema-definition">Schema Definition</Label>
          <Textarea
            id="edit-schema-definition"
            className="h-60 json-viewer font-mono"
            value={editedSchema.definition}
            onChange={(e) => setEditedSchema(prev => ({ ...prev, definition: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </BaseDialog>
  );
};

export default EditSchemaDialog;
