
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
import { FilterOptions, Schema, Status } from "@/types";
import { mockSchemas, getUniqueValues } from "@/lib/data";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Schemas = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    latestOnly: false
  });
  
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  
  // Create state for new schema form
  const [newSchemaData, setNewSchemaData] = useState({
    name: "",
    version: "1.0.0",
    definition: "{}",
    isNewName: false,
    owner: ""
  });

  // Filter data based on current filters
  const filteredSchemas = useMemo(() => {
    let filtered = mockSchemas.filter(schema => {
      const matchesSearch = filters.search ? 
        schema.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        JSON.stringify(schema.definition).toLowerCase().includes(filters.search.toLowerCase()) : 
        true;
      
      const matchesStatus = filters.status && filters.status.length > 0 ? 
        filters.status.includes(schema.status) : true;
      
      const matchesMember = filters.member && filters.member.length > 0 ? 
        filters.member.includes(schema.member) : true;
      
      return matchesSearch && matchesStatus && matchesMember;
    });
    
    // Handle latest only filter
    if (filters.latestOnly) {
      const latestVersions = new Map();
      
      // Group by name, then find latest version for each
      filtered.forEach(schema => {
        const current = latestVersions.get(schema.name);
        
        if (!current || compareVersions(schema.version, current.version) > 0) {
          latestVersions.set(schema.name, schema);
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

  // Compare versions helper function
  const compareVersions = (v1: string, v2: string) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    
    return 0;
  };

  // Get suggested next version
  const getNextPatchVersion = (version: string) => {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0') + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  };

  // Options for filtering
  const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
  const memberOptions = getUniqueValues(mockSchemas, "member");
  const nameOptions = getUniqueValues(mockSchemas, "name");

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewSchema = (schema: Schema) => {
    setSelectedSchema(schema);
    setIsViewOpen(true);
  };

  const handleEditSchema = (schema: Schema) => {
    setSelectedSchema(schema);
    setIsEditOpen(true);
  };

  const handleSchemaAction = (action: string) => {
    if (!selectedSchema) return;
    
    toast.success(`Schema ${action} successfully`, {
      description: `Schema ${selectedSchema.name} has been ${action}.`,
    });
    
    setIsViewOpen(false);
    setIsEditOpen(false);
  };

  const handleCreateSchema = () => {
    toast.success("New schema created successfully", {
      description: "The schema has been created with unstable status.",
    });
    setIsCreateOpen(false);
    setNewSchemaData({
      name: "",
      version: "1.0.0",
      definition: "{}",
      isNewName: false,
      owner: ""
    });
  };

  const handleNameChange = (value: string) => {
    if (value === "new") {
      setNewSchemaData(prev => ({ ...prev, isNewName: true, name: "" }));
    } else {
      setNewSchemaData(prev => ({ 
        ...prev, 
        isNewName: false, 
        name: value,
        // Find latest version and suggest next patch
        version: getNextPatchVersion(
          mockSchemas
            .filter(s => s.name === value)
            .sort((a, b) => compareVersions(b.version, a.version))[0]?.version || "1.0.0"
        ),
        // Load definition from latest version
        definition: JSON.stringify(
          mockSchemas
            .filter(s => s.name === value)
            .sort((a, b) => compareVersions(b.version, a.version))[0]?.definition || {},
          null,
          2
        )
      }));
    }
  };

  const formatJson = (json: any): string => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schemas</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            // Reset form state when dialog is closed
            setNewSchemaData({
              name: "",
              version: "1.0.0",
              definition: "{}",
              isNewName: false,
              owner: ""
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </DialogTrigger>
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
                  {newSchemaData.isNewName ? (
                    <Input
                      id="new-name"
                      placeholder="Enter new schema name"
                      value={newSchemaData.name}
                      onChange={(e) => setNewSchemaData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <Select onValueChange={handleNameChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or create schema" />
                      </SelectTrigger>
                      <SelectContent>
                        {nameOptions.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                        <SelectItem value="new">+ Create new schema</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {newSchemaData.isNewName && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => setNewSchemaData(prev => ({ ...prev, isNewName: false, name: "" }))}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="version">Version</Label>
                      <Input 
                        id="version" 
                        value={newSchemaData.version}
                        onChange={(e) => setNewSchemaData(prev => ({ ...prev, version: e.target.value }))}
                        placeholder="1.0.0" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input 
                  id="owner" 
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
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateSchema}>Create Schema</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <FilterBar
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        memberOptions={memberOptions}
        agentOptions={[]}
        showLatestOption={true}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Schemas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                  Name {sortConfig?.key === 'name' && (
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
              {filteredSchemas.map((schema, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{schema.name}</TableCell>
                  <TableCell>{schema.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={schema.status} />
                  </TableCell>
                  <TableCell>{schema.member}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => handleViewSchema(schema)}>View</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditSchema(schema)}>Edit</DropdownMenuItem>
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
              {filteredSchemas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No schemas found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Schema Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSchema?.name} - v{selectedSchema?.version}
            </DialogTitle>
            <DialogDescription>
              Status: <StatusBadge status={selectedSchema?.status || "unstable"} />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">JSON Schema Definition</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md font-mono whitespace-pre-wrap overflow-auto max-h-80">
                {selectedSchema && formatJson(selectedSchema.definition)}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">AI Member</p>
                  <p>{selectedSchema?.member}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p>{selectedSchema?.owner || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p>{selectedSchema?.version}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewOpen(false);
              handleEditSchema(selectedSchema as Schema);
            }}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Schema Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Schema - {selectedSchema?.name}
            </DialogTitle>
            <DialogDescription>
              Make changes to this schema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Schema Name</Label>
                <Input id="edit-name" defaultValue={selectedSchema?.name} />
              </div>
              <div>
                <Label htmlFor="edit-version">Version</Label>
                <Input id="edit-version" defaultValue={selectedSchema?.version} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-owner">Owner</Label>
              <Input 
                id="edit-owner" 
                defaultValue={selectedSchema?.owner || ""} 
                placeholder="AI Member (e.g., Cool AI)" 
              />
            </div>
            <div>
              <Label htmlFor="edit-schema-definition">Schema Definition</Label>
              <Textarea
                id="edit-schema-definition"
                className="h-60 json-viewer font-mono"
                defaultValue={selectedSchema ? formatJson(selectedSchema.definition) : '{}'}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={() => handleSchemaAction("updated")}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schemas;
