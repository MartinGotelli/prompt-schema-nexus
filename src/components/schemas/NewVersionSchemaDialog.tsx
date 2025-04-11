
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Schema, Status } from "@/types";
import { getNextPatchVersion, formatJson } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface NewVersionSchemaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schema: Schema | null;
  newSchemaData: {
    name: string;
    version: string;
    definition: string;
    isNewName: boolean;
    owner: string;
    status: Status;
  };
  setNewSchemaData: React.Dispatch<React.SetStateAction<{
    name: string;
    version: string;
    definition: string;
    isNewName: boolean;
    owner: string;
    status: Status;
  }>>;
}

const NewVersionSchemaDialog: React.FC<NewVersionSchemaDialogProps> = ({
  isOpen,
  onOpenChange,
  schema,
  newSchemaData,
  setNewSchemaData
}) => {
  useEffect(() => {
    if (schema && isOpen) {
      setNewSchemaData({
        name: schema.name,
        version: getNextPatchVersion(schema.version),
        definition: formatJson(schema.definition),
        isNewName: false,
        owner: schema.owner || "",
        status: "unstable"
      });
    }
  }, [schema, isOpen, setNewSchemaData]);

  if (!schema) return null;

  const handleCreateNewVersion = () => {
    toast.success("New schema version created successfully", {
      description: `New version of ${schema.name} schema has been created.`,
    });
    onOpenChange(false);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Create New Version - ${schema?.name}`}
      description="Create a new version based on the selected schema."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <VersionSelector 
            version={newSchemaData.version}
            onChange={(version) => setNewSchemaData(prev => ({ ...prev, version }))}
          />
          <StatusSelector 
            status={newSchemaData.status}
            onChange={(status) => setNewSchemaData(prev => ({ ...prev, status }))}
          />
        </div>
        <div>
          <Label htmlFor="new-owner">Owner</Label>
          <Input 
            id="new-owner" 
            value={newSchemaData.owner}
            onChange={(e) => setNewSchemaData(prev => ({ ...prev, owner: e.target.value }))}
            placeholder="AI Member (e.g., Cool AI)" 
          />
        </div>
        <div>
          <Label htmlFor="new-schema-definition">Schema Definition</Label>
          <Textarea
            id="new-schema-definition"
            className="h-60 json-viewer font-mono"
            value={newSchemaData.definition}
            onChange={(e) => setNewSchemaData(prev => ({ ...prev, definition: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleCreateNewVersion}>Create New Version</Button>
      </div>
    </BaseDialog>
  );
};

export default NewVersionSchemaDialog;
