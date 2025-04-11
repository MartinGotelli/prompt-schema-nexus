
import React from 'react';
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { Schema } from "@/types";
import { formatJson } from '@/lib/utils';
import BaseDialog from '@/components/dialogs/BaseDialog';

interface ViewSchemaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schema: Schema | null;
  onEdit: (schema: Schema) => void;
}

const ViewSchemaDialog: React.FC<ViewSchemaDialogProps> = ({
  isOpen,
  onOpenChange,
  schema,
  onEdit
}) => {
  if (!schema) return null;

  return (
    <BaseDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`${schema.name} - v${schema.version}`}
      description={`Status: `}
    >
      <div className="inline-block -mt-5 mb-2">
        <StatusBadge status={schema.status || "unstable"} />
      </div>
      
      <div className="grid gap-4">
        <div>
          <h3 className="text-sm font-medium mb-2">JSON Schema Definition</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md font-mono whitespace-pre-wrap overflow-auto max-h-80">
            {schema && formatJson(schema.definition)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">AI Member</p>
              <p>{schema.member}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner</p>
              <p>{schema.owner || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p>{schema.version}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        <Button onClick={() => {
          onOpenChange(false);
          onEdit(schema);
        }}>Edit</Button>
      </div>
    </BaseDialog>
  );
};

export default ViewSchemaDialog;
