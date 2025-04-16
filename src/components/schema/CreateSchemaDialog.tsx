import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getNextPatchVersion, formatJson, compareVersions } from "@/lib/utils";
import { mockSchemas, getUniqueValues } from "@/lib/data";
import { Status } from "@/types";

interface CreateSchemaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface SchemaFormData {
  name: string;
  version: string;
  definition: string;
  isNewName: boolean;
  owner: string;
  status: Status;
}

const CreateSchemaDialog: React.FC<CreateSchemaDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onSuccess 
}) => {
  const [newSchemaData, setNewSchemaData] = useState<SchemaFormData>({
    name: "",
    version: "1.0.0",
    definition: "{}",
    isNewName: false,
    owner: "",
    status: "unstable"
  });

  const nameOptions = getUniqueValues(mockSchemas, "name");

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
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
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
    }}>
      <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Schema</DialogTitle>
          <DialogDescription>
            Create a new JSON schema.
          </DialogDescription>
        </DialogHeader>
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
                    <SelectItem value="new">Create New Schema</SelectItem>
                    {nameOptions.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={newSchemaData.version}
                onChange={(e) => setNewSchemaData(prev => ({ ...prev, version: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="definition">Schema Definition</Label>
            <Textarea
              id="definition"
              value={newSchemaData.definition}
              onChange={(e) => setNewSchemaData(prev => ({ ...prev, definition: e.target.value }))}
              className="mt-1 h-64 font-mono"
              placeholder="Enter JSON schema definition"
            />
          </div>
          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={newSchemaData.owner}
              onChange={(e) => setNewSchemaData(prev => ({ ...prev, owner: e.target.value }))}
              className="mt-1"
              placeholder="AI Member (e.g., Cool AI)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateSchema}>Create Schema</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchemaDialog; 