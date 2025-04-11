
import React, { useState, useMemo } from 'react';
import { Plus, Filter, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterBar from "@/components/ui/FilterBar";
import { FilterOptions, Prompt, Status } from "@/types";
import { mockPrompts, getUniqueValues } from "@/lib/data";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Prompts = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    agent: [],
    type: []
  });
  
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter data based on current filters
  const filteredPrompts = useMemo(() => {
    return mockPrompts.filter(prompt => {
      const matchesSearch = filters.search ? 
        prompt.agent.toLowerCase().includes(filters.search.toLowerCase()) || 
        prompt.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        prompt.template.toLowerCase().includes(filters.search.toLowerCase()) : 
        true;
      
      const matchesStatus = filters.status && filters.status.length > 0 ? 
        filters.status.includes(prompt.status) : true;
      
      const matchesMember = filters.member && filters.member.length > 0 ? 
        filters.member.includes(prompt.member) : true;
      
      const matchesAgent = filters.agent && filters.agent.length > 0 ? 
        filters.agent.includes(prompt.agent) : true;
      
      const matchesType = filters.type && filters.type.length > 0 ? 
        filters.type.includes(prompt.type) : true;
      
      return matchesSearch && matchesStatus && matchesMember && matchesAgent && matchesType;
    });
  }, [filters]);

  // Options for filtering
  const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
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

  const handlePromptAction = (action: string) => {
    if (!selectedPrompt) return;
    
    toast.success(`Prompt ${action} successfully`, {
      description: `Prompt ${selectedPrompt.type} for ${selectedPrompt.agent} has been ${action}.`,
    });
    
    setIsViewOpen(false);
    setIsEditOpen(false);
  };

  const handleCreatePrompt = () => {
    toast.success("New prompt created successfully", {
      description: "The prompt has been created with unstable status.",
    });
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prompts</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Prompt</DialogTitle>
              <DialogDescription>
                Create a new prompt for an AI agent. New prompts are created with unstable status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select defaultValue="qa">
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
                  <Label htmlFor="agent">Agent</Label>
                  <Select defaultValue="customer-support">
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
              <div>
                <Label htmlFor="prompt-template">Prompt Template</Label>
                <Textarea
                  id="prompt-template"
                  className="h-40 code-editor"
                  placeholder="Enter your prompt template with variables like {{input}} or {{context}}..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePrompt}>Create Prompt</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <FilterBar
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        memberOptions={memberOptions}
        agentOptions={agentOptions}
        typeOptions={typeOptions}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrompts.map((prompt, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{prompt.type}</TableCell>
                  <TableCell>{prompt.agent}</TableCell>
                  <TableCell>{prompt.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={prompt.status} />
                  </TableCell>
                  <TableCell>{prompt.member}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => handleViewPrompt(prompt)}>View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPrompt(prompt)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Create New Version</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="text-amber-600">Mark as Draft</DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">Mark as Stable</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Mark as Deprecated</DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPrompts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No prompts found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Prompt Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPrompt?.type} Prompt - v{selectedPrompt?.version}
            </DialogTitle>
            <DialogDescription>
              Agent: {selectedPrompt?.agent} | Status: <StatusBadge status={selectedPrompt?.status || "unstable"} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Prompt Template</h3>
              <div className="p-4 bg-gray-900 text-white rounded-md font-mono whitespace-pre-wrap break-words">
                {selectedPrompt?.template}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated By</p>
                  <p>{selectedPrompt?.member}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version Bump</p>
                  <p className="capitalize">{selectedPrompt?.bump}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => handleEditPrompt(selectedPrompt as Prompt)}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Prompt - v{selectedPrompt?.version}
            </DialogTitle>
            <DialogDescription>
              Make changes to this prompt. You'll create a new version when saving.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select defaultValue={selectedPrompt?.type}>
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
                <Select defaultValue={selectedPrompt?.agent}>
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
            <div>
              <Label htmlFor="bump">Version Bump</Label>
              <Select defaultValue="minor">
                <SelectTrigger>
                  <SelectValue placeholder="Select version bump" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="patch">Patch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-prompt-template">Prompt Template</Label>
              <Textarea
                id="edit-prompt-template"
                className="h-40 code-editor"
                defaultValue={selectedPrompt?.template}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={() => handlePromptAction("updated")}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prompts;
