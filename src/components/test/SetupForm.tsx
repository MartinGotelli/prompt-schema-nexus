
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SetupFormProps {
  selectedMember: string;
  selectedAction: string;
  selectedConverseType: string;
  selectedExtractType: string;
  selectedSchema: string;
  onMemberChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onConverseTypeChange: (value: string) => void;
  onExtractTypeChange: (value: string) => void;
  onSchemaChange: (value: string) => void;
  onSubmit: () => void;
}

const members = ['Shotgun', 'CSR', 'Analyst', 'Help'];
const actions = ['converse', 'extract', 'converse and extract'];
const conversePromptTypes = ['greeting', 'followup', 'closing'];
const extractPromptTypes = ['contact', 'request', 'feedback'];
const schemaNames = ['contact_info', 'support_request', 'feedback_form'];

export const SetupForm: React.FC<SetupFormProps> = ({
  selectedMember,
  selectedAction,
  selectedConverseType,
  selectedExtractType,
  selectedSchema,
  onMemberChange,
  onActionChange,
  onConverseTypeChange,
  onExtractTypeChange,
  onSchemaChange,
  onSubmit,
}) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Test AI Member</h1>
      <Card>
        <CardHeader>
          <CardTitle>Setup Test Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">AI Member</Label>
            <Select value={selectedMember} onValueChange={onMemberChange}>
              <SelectTrigger id="member">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={selectedAction} onValueChange={onActionChange}>
              <SelectTrigger id="action">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedAction === 'converse' || selectedAction === 'converse and extract') && (
            <div className="space-y-2">
              <Label htmlFor="converseType">Converse Prompt Type</Label>
              <Select value={selectedConverseType} onValueChange={onConverseTypeChange}>
                <SelectTrigger id="converseType">
                  <SelectValue placeholder="Select converse type" />
                </SelectTrigger>
                <SelectContent>
                  {conversePromptTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedAction === 'extract' || selectedAction === 'converse and extract') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="extractType">Extract Prompt Type</Label>
                <Select value={selectedExtractType} onValueChange={onExtractTypeChange}>
                  <SelectTrigger id="extractType">
                    <SelectValue placeholder="Select extract type" />
                  </SelectTrigger>
                  <SelectContent>
                    {extractPromptTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schema">Schema</Label>
                <Select value={selectedSchema} onValueChange={onSchemaChange}>
                  <SelectTrigger id="schema">
                    <SelectValue placeholder="Select schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemaNames.map(schema => (
                      <SelectItem key={schema} value={schema}>
                        {schema}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={onSubmit} className="w-full">
            Start Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
