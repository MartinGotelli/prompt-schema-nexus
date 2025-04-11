
import React, { useState, useMemo } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
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
  });
  
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter data based on current filters
  const filteredSchemas = useMemo(() => {
    return mockSchemas.filter(schema => {
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
  }, [filters]);

  // Options for filtering
  const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
  const memberOptions = getUniqueValues(mockSchemas, "member");

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
  };

  const formatJson = (json: any): string => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schemas</h1>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
              <div>
                <Label htmlFor="name">Schema Name</Label>
                <Input id="name" placeholder="e.g., customer-data" />
              </div>
              <div>
                <Label htmlFor="schema-definition">JSON Schema Definition</Label>
                <Textarea
                  id="schema-definition"
                  className="h-60 json-viewer"
                  placeholder='{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}'
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
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Schemas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Member</TableHead>
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
                  <p className="text-sm text-muted-foreground">Last Updated By</p>
                  <p>{selectedSchema?.member}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version Bump</p>
                  <p className="capitalize">{selectedSchema?.bump}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            <Button onClick={() => handleEditSchema(selectedSchema as Schema)}>Edit</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Schema Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Schema - v{selectedSchema?.version}
            </DialogTitle>
            <DialogDescription>
              Make changes to this schema. You'll create a new version when saving.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-name">Schema Name</Label>
              <Input id="edit-name" defaultValue={selectedSchema?.name} />
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
              <Label htmlFor="edit-schema-definition">Schema Definition</Label>
              <Textarea
                id="edit-schema-definition"
                className="h-60 json-viewer"
                defaultValue={selectedSchema ? formatJson(selectedSchema.definition) : ''}
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
