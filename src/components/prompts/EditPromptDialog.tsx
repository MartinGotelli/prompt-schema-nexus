
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Prompt, Status } from "@/types";
import { statusOptions } from '@/lib/utils';
import StatusSelector from '@/components/common/StatusSelector';
import VersionSelector from '@/components/common/VersionSelector';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface EditPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  typeOptions: string[];
  agentOptions: string[];
}

const EditPromptDialog: React.FC<EditPromptDialogProps> = ({
  isOpen,
  onOpenChange,
  prompt,
  typeOptions,
  agentOptions
}) => {
  const [editedPrompt, setEditedPrompt] = useState<{
    type: string;
    agent: string;
    version: string;
    template: string;
    owner: string;
    status: Status;
  }>({
    type: "",
    agent: "",
    version: "",
    template: "",
    owner: "",
    status: "unstable"
  });

  useEffect(() => {
    if (prompt) {
      setEditedPrompt({
        type: prompt.type,
        agent: prompt.agent,
        version: prompt.version,
        template: prompt.template,
        owner: prompt.owner || "",
        status: prompt.status
      });
    }
  }, [prompt]);

  if (!prompt) return null;

  const handleSaveChanges = () => {
    toast.success("Prompt updated successfully", {
      description: `Prompt ${prompt.type} for ${prompt.agent} has been updated.`,
    });
    onOpenChange(false);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Edit Prompt - ${prompt.type}`}
      description="Make changes to this prompt."
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-type">Type</Label>
            <Select 
              value={editedPrompt.type} 
              onValueChange={(value) => setEditedPrompt(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-agent">Agent</Label>
            <Select 
              value={editedPrompt.agent}
              onValueChange={(value) => setEditedPrompt(prev => ({ ...prev, agent: value }))}
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
            version={editedPrompt.version}
            onChange={(version) => setEditedPrompt(prev => ({ ...prev, version }))}
          />
          <div>
            <Label htmlFor="edit-owner">Owner</Label>
            <Input 
              id="edit-owner" 
              value={editedPrompt.owner} 
              onChange={(e) => setEditedPrompt(prev => ({ ...prev, owner: e.target.value }))}
              placeholder="AI Member (e.g., Cool AI)" 
            />
          </div>
          <StatusSelector 
            status={editedPrompt.status}
            onChange={(status) => setEditedPrompt(prev => ({ ...prev, status }))}
          />
        </div>
        <div>
          <Label htmlFor="edit-prompt-template">Prompt Template</Label>
          <Textarea
            id="edit-prompt-template"
            className="h-40 code-editor"
            value={editedPrompt.template}
            onChange={(e) => setEditedPrompt(prev => ({ ...prev, template: e.target.value }))}
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

export default EditPromptDialog;
