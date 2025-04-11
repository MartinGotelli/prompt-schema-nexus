
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Prompt, Status } from "@/types";
import { getNextPatchVersion } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface NewVersionPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
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
  agentOptions: string[];
}

const NewVersionPromptDialog: React.FC<NewVersionPromptDialogProps> = ({
  isOpen,
  onOpenChange,
  prompt,
  newPromptData,
  setNewPromptData,
  agentOptions
}) => {
  useEffect(() => {
    if (prompt && isOpen) {
      setNewPromptData({
        type: prompt.type,
        agent: prompt.agent,
        version: getNextPatchVersion(prompt.version),
        template: prompt.template,
        isNewType: false,
        owner: prompt.owner || "",
        status: "unstable"
      });
    }
  }, [prompt, isOpen, setNewPromptData]);

  if (!prompt) return null;

  const handleCreateNewVersion = () => {
    toast.success("New prompt version created successfully", {
      description: `New version of ${prompt.type} prompt has been created.`,
    });
    onOpenChange(false);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Create New Version - ${prompt?.type}`}
      description="Create a new version based on the selected prompt."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="new-type">Type</Label>
            <Input 
              id="new-type" 
              value={newPromptData.type}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="new-agent">Agent</Label>
            <Select 
              value={newPromptData.agent}
              onValueChange={(value) => setNewPromptData(prev => ({ ...prev, agent: value }))}
            >
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
            <Label htmlFor="new-owner">Owner</Label>
            <Input 
              id="new-owner" 
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
          <Label htmlFor="new-prompt-template">Prompt Template</Label>
          <Textarea
            id="new-prompt-template"
            className="h-40 code-editor"
            value={newPromptData.template}
            onChange={(e) => setNewPromptData(prev => ({ ...prev, template: e.target.value }))}
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

export default NewVersionPromptDialog;
