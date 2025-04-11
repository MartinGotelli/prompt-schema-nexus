
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import FilterBar from "@/components/ui/FilterBar";
import { FilterOptions, Prompt, Status } from "@/types";
import { mockPrompts, getUniqueValues } from "@/lib/data";
import { toast } from 'sonner';
import { statusOptions } from '@/lib/utils';
import { DialogTrigger } from "@/components/ui/dialog";
import PromptTable from "@/components/prompts/PromptTable";
import CreatePromptDialog from "@/components/prompts/CreatePromptDialog";
import ViewPromptDialog from "@/components/prompts/ViewPromptDialog";
import EditPromptDialog from "@/components/prompts/EditPromptDialog";
import NewVersionPromptDialog from "@/components/prompts/NewVersionPromptDialog";

const Prompts = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    agent: [],
    type: [],
    latestOnly: false
  });
  
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNewVersionOpen, setIsNewVersionOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  
  // Create state for new prompt form
  const [newPromptData, setNewPromptData] = useState({
    type: "",
    agent: "",
    version: "1.0.0",
    template: "",
    isNewType: false,
    owner: "",
    status: "unstable" as Status
  });

  // Options for filtering
  const memberOptions = getUniqueValues(mockPrompts, "member");
  const agentOptions = getUniqueValues(mockPrompts, "agent");
  const typeOptions = getUniqueValues(mockPrompts, "type");

  const handleViewPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsViewOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsEditOpen(true);
  };

  const handleCreateNewVersion = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsNewVersionOpen(true);
  };

  const closeAllDialogs = () => {
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsCreateOpen(false);
    setIsNewVersionOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prompts</h1>
        
        <DialogTrigger asChild>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </DialogTrigger>
      </div>
      
      <FilterBar
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        memberOptions={memberOptions}
        agentOptions={agentOptions}
        typeOptions={typeOptions}
        showLatestOption={true}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <PromptTable 
            filters={filters}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            onView={handleViewPrompt}
            onEdit={handleEditPrompt}
            onCreateNewVersion={handleCreateNewVersion}
          />
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <CreatePromptDialog 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        newPromptData={newPromptData}
        setNewPromptData={setNewPromptData}
        typeOptions={typeOptions}
        agentOptions={agentOptions}
      />
      
      <ViewPromptDialog 
        isOpen={isViewOpen} 
        onOpenChange={setIsViewOpen}
        prompt={selectedPrompt}
        onEdit={handleEditPrompt}
      />
      
      <EditPromptDialog 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen}
        prompt={selectedPrompt}
        typeOptions={typeOptions}
        agentOptions={agentOptions}
      />
      
      <NewVersionPromptDialog 
        isOpen={isNewVersionOpen} 
        onOpenChange={setIsNewVersionOpen}
        prompt={selectedPrompt}
        newPromptData={newPromptData}
        setNewPromptData={setNewPromptData}
        agentOptions={agentOptions}
      />
    </div>
  );
};

export default Prompts;
