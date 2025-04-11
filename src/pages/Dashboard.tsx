
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPrompts, mockSchemas, getUniqueValues } from "@/lib/data";
import FilterBar from "@/components/ui/FilterBar";
import { FilterOptions, Status, Prompt, Schema } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    agent: [],
    type: []
  });
  
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false);
  const [isCreateSchemaOpen, setIsCreateSchemaOpen] = useState(false);
  
  const navigate = useNavigate();
  
  // New state for prompt and schema forms
  const [newPromptData, setNewPromptData] = useState({
    type: "",
    agent: "",
    version: "1.0.0",
    template: "",
    owner: ""
  });
  
  const [newSchemaData, setNewSchemaData] = useState({
    name: "",
    version: "1.0.0",
    definition: "{}",
    owner: ""
  });

  // Filter data based on current filters
  const filteredPrompts = mockPrompts.filter(prompt => {
    const matchesSearch = filters.search ?
      prompt.agent.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.type.toLowerCase().includes(filters.search.toLowerCase()) :
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

  const filteredSchemas = mockSchemas.filter(schema => {
    const matchesSearch = filters.search ?
      schema.name.toLowerCase().includes(filters.search.toLowerCase()) :
      true;

    const matchesStatus = filters.status && filters.status.length > 0 ?
      filters.status.includes(schema.status) : true;

    const matchesMember = filters.member && filters.member.length > 0 ?
      filters.member.includes(schema.member) : true;

    return matchesSearch && matchesStatus && matchesMember;
  });

  // Options for filtering
  const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
  const memberOptions = [...new Set([
    ...getUniqueValues(mockPrompts, "member"),
    ...getUniqueValues(mockSchemas, "member"),
  ])];
  const agentOptions = getUniqueValues(mockPrompts, "agent");
  const typeOptions = getUniqueValues(mockPrompts, "type");

  // Calculate statistics
  const countByType = filteredPrompts.reduce((acc, prompt) => {
    acc[prompt.type] = (acc[prompt.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countByAgent = filteredPrompts.reduce((acc, prompt) => {
    acc[prompt.agent] = (acc[prompt.agent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countByStatus = [
    ...filteredPrompts,
    ...filteredSchemas
  ].reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCreatePrompt = () => {
    toast.success("New prompt created successfully", {
      description: "The prompt has been created with unstable status.",
    });
    setIsCreatePromptOpen(false);
    setNewPromptData({
      type: "",
      agent: "",
      version: "1.0.0",
      template: "",
      owner: ""
    });
    navigate("/prompts");
  };

  const handleCreateSchema = () => {
    toast.success("New schema created successfully", {
      description: "The schema has been created with unstable status.",
    });
    setIsCreateSchemaOpen(false);
    setNewSchemaData({
      name: "",
      version: "1.0.0",
      definition: "{}",
      owner: ""
    });
    navigate("/schemas");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <Button onClick={() => setIsCreatePromptOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Prompt
          </Button>
          <Button onClick={() => setIsCreateSchemaOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Schema
          </Button>
        </div>
      </div>

      <FilterBar
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        memberOptions={memberOptions}
        agentOptions={agentOptions}
        typeOptions={typeOptions}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Prompts</CardTitle>
            <CardDescription>Number of prompt templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{filteredPrompts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Schemas</CardTitle>
            <CardDescription>Number of schema definitions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{filteredSchemas.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Prompt Types</CardTitle>
            <CardDescription>Different types of prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{Object.keys(countByType).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Agents</CardTitle>
            <CardDescription>AI agents using prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{Object.keys(countByAgent).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prompts by Type</CardTitle>
            <CardDescription>
              Distribution of prompts across different types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(countByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{type}</p>
                    <p className="text-sm text-muted-foreground">{count} prompts</p>
                  </div>
                  <div className="ml-auto font-bold">{Math.round((count / filteredPrompts.length) * 100)}%</div>
                </div>
              ))}
              {Object.keys(countByType).length === 0 && (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
              <div className="mt-2 text-right">
                <Button variant="link" size="sm" asChild>
                  <Link to="/prompts">View all prompts</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items by Status</CardTitle>
            <CardDescription>
              Distribution of prompts and schemas by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(countByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={status as Status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{count} items</p>
                  </div>
                  <div className="ml-auto font-bold">
                    {Math.round((count / (filteredPrompts.length + filteredSchemas.length)) * 100)}%
                  </div>
                </div>
              ))}
              {Object.keys(countByStatus).length === 0 && (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Prompt Dialog */}
      <Dialog open={isCreatePromptOpen} onOpenChange={setIsCreatePromptOpen}>
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
                <Select onValueChange={value => setNewPromptData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    <SelectItem value="new">+ Create new type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agent">Agent</Label>
                <Select onValueChange={value => setNewPromptData(prev => ({ ...prev, agent: value }))}>
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
            <div className="grid grid-cols-2 gap-4">
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
            <Button variant="outline" onClick={() => setIsCreatePromptOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePrompt}>Create Prompt</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Create Schema Dialog */}
      <Dialog open={isCreateSchemaOpen} onOpenChange={setIsCreateSchemaOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Schema</DialogTitle>
            <DialogDescription>
              Create a new JSON schema. New schemas are created with unstable status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Schema Name</Label>
                <Input 
                  id="name" 
                  value={newSchemaData.name}
                  onChange={(e) => setNewSchemaData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., customer-data"
                />
              </div>
              <div>
                <Label htmlFor="schema-version">Version</Label>
                <Input 
                  id="schema-version" 
                  value={newSchemaData.version}
                  onChange={(e) => setNewSchemaData(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0" 
                />
              </div>
            </div>
            <div>
              <Label htmlFor="schema-owner">Owner</Label>
              <Input 
                id="schema-owner" 
                value={newSchemaData.owner}
                onChange={(e) => setNewSchemaData(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="AI Member (e.g., Cool AI)" 
              />
            </div>
            <div>
              <Label htmlFor="schema-definition">JSON Schema Definition</Label>
              <Textarea
                id="schema-definition"
                className="h-60 json-viewer font-mono"
                placeholder='{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}'
                value={newSchemaData.definition}
                onChange={(e) => setNewSchemaData(prev => ({ ...prev, definition: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateSchemaOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSchema}>Create Schema</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
