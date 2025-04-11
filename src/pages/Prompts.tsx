
import React, { useState, useMemo } from 'react';
import { Plus, ChevronDown, ArrowUpDown } from 'lucide-react';
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
import { compareVersions, getNextPatchVersion, statusOptions } from '@/lib/utils';

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

  // Filter data based on current filters
  const filteredPrompts = useMemo(() => {
    let filtered = mockPrompts.filter(prompt => {
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
    
    // Handle latest only filter
    if (filters.latestOnly) {
      const latestVersions = new Map();
      
      // Group by type and agent, then find the latest version for each
      filtered.forEach(prompt => {
        const key = `${prompt.type}-${prompt.agent}`;
        const current = latestVersions.get(key);
        
        if (!current || compareVersions(prompt.version, current.version) > 0) {
          latestVersions.set(key, prompt);
        }
      });
      
      filtered = Array.from(latestVersions.values());
    }
    
    // Apply sorting if configured
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [filters, sortConfig]);

  // Options for filtering
  const memberOptions = getUniqueValues(mockPrompts, "member");
  const agentOptions = getUniqueValues(mockPrompts, "agent");
  const typeOptions = getUniqueValues(mockPrompts, "type");

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
    
    // Pre-fill form with existing data but increment version
    setNewPromptData({
      type: prompt.type,
      agent: prompt.agent,
      version: getNextPatchVersion(prompt.version),
      template: prompt.template,
      isNewType: false,
      owner: prompt.owner || "",
      status: "unstable"
    });
    
    setIsNewVersionOpen(true);
  };

  const handlePromptAction = (action: string) => {
    if (!selectedPrompt) return;
    
    toast.success(`Prompt ${action} successfully`, {
      description: `Prompt ${selectedPrompt.type} for ${selectedPrompt.agent} has been ${action}.`,
    });
    
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsNewVersionOpen(false);
  };

  const handleCreatePrompt = () => {
    toast.success("New prompt created successfully", {
      description: "The prompt has been created with unstable status.",
    });
    setIsCreateOpen(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Prompts</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            // Reset form state when dialog is closed
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
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Create New Prompt</DialogTitle>
              <DialogDescription>
                Create a new prompt for an AI agent.
              </DialogDescription>
            </DialogHeader>
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
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input 
                    id="version" 
                    value={newPromptData.version}
                    onChange={(e) => setNewPromptData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0" 
                  />
                </div>
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Input 
                    id="owner" 
                    value={newPromptData.owner}
                    onChange={(e) => setNewPromptData(prev => ({ ...prev, owner: e.target.value }))}
                    placeholder="AI Member (e.g., Cool AI)" 
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newPromptData.status}
                    onValueChange={(value) => setNewPromptData(prev => ({ ...prev, status: value as Status }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
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
                  value={newPromptData.template}
                  onChange={(e) => setNewPromptData(prev => ({ ...prev, template: e.target.value }))}
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
        showLatestOption={true}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('type')} className="cursor-pointer">
                  Type {sortConfig?.key === 'type' && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead onClick={() => requestSort('agent')} className="cursor-pointer">
                  Agent {sortConfig?.key === 'agent' && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead onClick={() => requestSort('version')} className="cursor-pointer">
                  Version {sortConfig?.key === 'version' && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead onClick={() => requestSort('status')} className="cursor-pointer">
                  Status {sortConfig?.key === 'status' && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
                <TableHead onClick={() => requestSort('member')} className="cursor-pointer">
                  Member {sortConfig?.key === 'member' && (
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  )}
                </TableHead>
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
                          <DropdownMenuItem onClick={() => handleCreateNewVersion(prompt)}>Create New Version</DropdownMenuItem>
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
        <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
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
                  <p className="text-sm text-muted-foreground">AI Member</p>
                  <p>{selectedPrompt?.member}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p>{selectedPrompt?.owner || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p>{selectedPrompt?.version}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewOpen(false);
              handleEditPrompt(selectedPrompt as Prompt);
            }}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              Edit Prompt - {selectedPrompt?.type}
            </DialogTitle>
            <DialogDescription>
              Make changes to this prompt.
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-version">Version</Label>
                <Input 
                  id="edit-version" 
                  defaultValue={selectedPrompt?.version} 
                  placeholder="1.0.0" 
                />
              </div>
              <div>
                <Label htmlFor="edit-owner">Owner</Label>
                <Input 
                  id="edit-owner" 
                  defaultValue={selectedPrompt?.owner || ""} 
                  placeholder="AI Member (e.g., Cool AI)" 
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedPrompt?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

      {/* Create New Version Dialog */}
      <Dialog open={isNewVersionOpen} onOpenChange={setIsNewVersionOpen}>
        <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              Create New Version - {selectedPrompt?.type}
            </DialogTitle>
            <DialogDescription>
              Create a new version based on the selected prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-type">Type</Label>
                <Input 
                  id="new-type" 
                  value={newPromptData.type}
                  readOnly
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
              <div>
                <Label htmlFor="new-version">Version</Label>
                <Input 
                  id="new-version" 
                  value={newPromptData.version}
                  onChange={(e) => setNewPromptData(prev => ({ ...prev, version: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-owner">Owner</Label>
                <Input 
                  id="new-owner" 
                  value={newPromptData.owner}
                  onChange={(e) => setNewPromptData(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="AI Member (e.g., Cool AI)" 
                />
              </div>
              <div>
                <Label htmlFor="new-status">Status</Label>
                <Select 
                  value={newPromptData.status}
                  onValueChange={(value) => setNewPromptData(prev => ({ ...prev, status: value as Status }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            <Button variant="outline" onClick={() => setIsNewVersionOpen(false)}>Cancel</Button>
            <Button onClick={() => handlePromptAction("created")}>Create New Version</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prompts;
