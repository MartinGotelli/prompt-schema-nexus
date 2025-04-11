
import React from 'react';
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { Prompt } from "@/types";
import BaseDialog from '@/components/dialogs/BaseDialog';

interface ViewPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onEdit: (prompt: Prompt) => void;
}

const ViewPromptDialog: React.FC<ViewPromptDialogProps> = ({
  isOpen,
  onOpenChange,
  prompt,
  onEdit
}) => {
  if (!prompt) return null;

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`${prompt.type} Prompt - v${prompt.version}`}
      description={`Agent: ${prompt.agent} | Status: `}
    >
      <div className="inline-block -mt-5 mb-2">
        <StatusBadge status={prompt.status || "unstable"} />
      </div>
      
      <div className="grid gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Prompt Template</h3>
          <div className="p-4 bg-gray-900 text-white rounded-md font-mono whitespace-pre-wrap break-words">
            {prompt.template}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">AI Member</p>
              <p>{prompt.member}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p>{prompt.owner || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p>{prompt.version}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        <Button onClick={() => {
          onOpenChange(false);
          onEdit(prompt);
        }}>Edit</Button>
      </div>
    </BaseDialog>
  );
};

export default ViewPromptDialog;
