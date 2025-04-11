
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Status } from "@/types";
import { getNextPatchVersion } from '@/lib/utils';
import { mockPrompts } from "@/lib/data";
import { compareVersions } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface CreatePromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPromptData: {
    type: string;
    agent: string;
    version: string;
    template: string;
    isNewType: boolean;
    owner: string;
    status: Status;
  };
  setNewPromptData: React.Dispatch<React.SetStateAction<{
    type: string;
    agent: string;
    version: string;
    template: string;
    isNewType: boolean;
    owner: string;
    status: Status;
  }>>;
  typeOptions: string[];
  agentOptions: string[];
}

const CreatePromptDialog: React.FC<CreatePromptDialogProps> = ({
  isOpen,
  onOpenChange,
  newPromptData,
  setNewPromptData,
  typeOptions,
  agentOptions
}) => {
  const handleTypeChange = (value: string) => {
    if (value === "new") {
      setNewPromptData(prev => ({ ...prev, isNewType: true, type: "" }));
    } else {
      setNewPromptData(prev => ({ 
        ...prev, 
        isNewType: false, 
        type: value,
        // Find latest version and suggest next patch - based only on type, not agent
        version: getNextPatchVersion(
          mockPrompts
            .filter(p => p.type === value)
            .sort((a, b) => compareVersions(b.version, a.version))[0]?.version || "1.0.0"
        ),
        // Load template from latest version matching the type, regardless of agent
        template: mockPrompts
          .filter(p => p.type === value)
          .sort((a, b) => compareVersions(b.version, a.version))[0]?.template || ""
      }));
    }
  };

  const handleAgentChange = (value: string) => {
    setNewPromptData(prev => ({ 
      ...prev, 
      agent: value,
    }));
  };

  const handleCreatePrompt = () => {
    toast.success("New prompt created successfully", {
      description: "The prompt has been created with unstable status.",
    });
    onOpenChange(false);
    setNewPromptData({
      type: "",
      agent: "",
      version: "1.0.0",
      template: "",
      isNewType: false,
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
          setNewPromptData({
            type: "",
            agent: "",
            version: "1.0.0",
            template: "",
            isNewType: false,
            owner: "",
            status: "unstable"
          });
        }
      }}
      title="Create New Prompt"
      description="Create a new prompt for an AI agent."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            {newPromptData.isNewType ? (
              <Input
                id="new-type"
                placeholder="Enter new type"
                value={newPromptData.type}
                onChange={(e) => setNewPromptData(prev => ({ ...prev, type: e.target.value }))}
                className="mt-1"
              />
            ) : (
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or create type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                  <SelectItem value="new">+ Create new type</SelectItem>
                </SelectContent>
              </Select>
            )}
            {newPromptData.isNewType && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1"
                onClick={() => setNewPromptData(prev => ({ ...prev, isNewType: false, type: "" }))}
              >
                Cancel
              </Button>
            )}
          </div>
          <div>
            <Label htmlFor="agent">Agent</Label>
            <Select onValueChange={handleAgentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agentOptions.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <VersionSelector 
            version={newPromptData.version}
            onChange={(version) => setNewPromptData(prev => ({ ...prev, version }))}
          />
          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input 
              id="owner" 
              value={newPromptData.owner}
              onChange={(e) => setNewPromptData(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="AI Member (e.g., Cool AI)" 
            />
          </div>
          <StatusSelector 
            status={newPromptData.status}
            onChange={(status) => setNewPromptData(prev => ({ ...prev, status }))}
          />
        </div>
        <div>
          <Label htmlFor="prompt-template">Prompt Template</Label>
          <Textarea
            id="prompt-template"
            className="h-40 code-editor"
            placeholder="Enter your prompt template with variables like {{input}} or {{context}}..."
            value={newPromptData.template}
            onChange={(e) => setNewPromptData(prev => ({ ...prev, template: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleCreatePrompt}>Create Prompt</Button>
      </div>
    </BaseDialog>
  );
};

export default CreatePromptDialog;
