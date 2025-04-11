
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Status } from "@/types";
import { getNextPatchVersion, formatJson } from '@/lib/utils';
import { mockSchemas } from "@/lib/data";
import { compareVersions } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface CreateSchemaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  nameOptions: string[];
}

const CreateSchemaDialog: React.FC<CreateSchemaDialogProps> = ({
  isOpen,
  onOpenChange,
  newSchemaData,
  setNewSchemaData,
  nameOptions
}) => {
  const handleNameChange = (value: string) => {
    if (value === "new") {
      setNewSchemaData(prev => ({ ...prev, isNewName: true, name: "" }));
    } else {
      setNewSchemaData(prev => ({ 
        ...prev, 
        isNewName: false, 
        name: value,
        // Find latest version and suggest next patch
        version: getNextPatchVersion(
          mockSchemas
            .filter(s => s.name === value)
            .sort((a, b) => compareVersions(b.version, a.version))[0]?.version || "1.0.0"
        ),
        // Load definition from latest version
        definition: formatJson(
          mockSchemas
            .filter(s => s.name === value)
            .sort((a, b) => compareVersions(b.version, a.version))[0]?.definition || {},
        )
      }));
    }
  };

  const handleCreateSchema = () => {
    toast.success("New schema created successfully", {
      description: "The schema has been created with unstable status.",
    });
    onOpenChange(false);
    setNewSchemaData({
      name: "",
      version: "1.0.0",
      definition: "{}",
      isNewName: false,
      owner: "",
      status: "unstable"
    });
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          setNewSchemaData({
            name: "",
            version: "1.0.0",
            definition: "{}",
            isNewName: false,
            owner: "",
            status: "unstable"
          });
        }
      }}
      title="Create New Schema"
      description="Create a new JSON schema."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Schema Name</Label>
            {newSchemaData.isNewName ? (
              <Input
                id="new-name"
                placeholder="Enter new schema name"
                value={newSchemaData.name}
                onChange={(e) => setNewSchemaData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            ) : (
              <Select onValueChange={handleNameChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or create schema" />
                </SelectTrigger>
                <SelectContent>
                  {nameOptions.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                  <SelectItem value="new">+ Create new schema</SelectItem>
                </SelectContent>
              </Select>
            )}
            {newSchemaData.isNewName && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1"
                onClick={() => setNewSchemaData(prev => ({ ...prev, isNewName: false, name: "" }))}
              >
                Cancel
              </Button>
            )}
          </div>
          <VersionSelector 
            version={newSchemaData.version}
            onChange={(version) => setNewSchemaData(prev => ({ ...prev, version }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input 
              id="owner" 
              value={newSchemaData.owner}
              onChange={(e) => setNewSchemaData(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="AI Member (e.g., Cool AI)" 
            />
          </div>
          <StatusSelector 
            status={newSchemaData.status}
            onChange={(status) => setNewSchemaData(prev => ({ ...prev, status }))}
          />
        </div>
        <div>
          <Label htmlFor="schema-definition">JSON Schema Definition</Label>
          <Textarea
            id="schema-definition"
            className="h-60 json-viewer font-mono"
            placeholder='{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}'
            value={newSchemaData.definition}
            onChange={(e) => setNewSchemaData(prev => ({ ...prev, definition: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleCreateSchema}>Create Schema</Button>
      </div>
    </BaseDialog>
  );
};

export default CreateSchemaDialog;
