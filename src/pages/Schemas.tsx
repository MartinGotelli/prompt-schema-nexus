
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import FilterBar from "@/components/ui/FilterBar";
import { FilterOptions, Schema, Status } from "@/types";
import { mockSchemas, getUniqueValues } from "@/lib/data";
import { statusOptions } from '@/lib/utils';
import { DialogTrigger } from "@/components/ui/dialog";
import SchemaTable from "@/components/schemas/SchemaTable";
import CreateSchemaDialog from "@/components/schemas/CreateSchemaDialog";
import ViewSchemaDialog from "@/components/schemas/ViewSchemaDialog";
import EditSchemaDialog from "@/components/schemas/EditSchemaDialog";
import NewVersionSchemaDialog from "@/components/schemas/NewVersionSchemaDialog";

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
  const [isNewVersionOpen, setIsNewVersionOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  
  // Create state for new schema form
  const [newSchemaData, setNewSchemaData] = useState({
    name: "",
    version: "1.0.0",
    definition: "{}",
    isNewName: false,
    owner: "",
    status: "unstable" as Status
  });

  // Options for filtering
  const memberOptions = getUniqueValues(mockSchemas, "member");
  const nameOptions = getUniqueValues(mockSchemas, "name");

  const handleViewSchema = (schema: Schema) => {
    setSelectedSchema(schema);
    setIsViewOpen(true);
  };

  const handleEditSchema = (schema: Schema) => {
    setSelectedSchema(schema);
    setIsEditOpen(true);
  };

  const handleCreateNewVersion = (schema: Schema) => {
    setSelectedSchema(schema);
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
        <h1 className="text-3xl font-bold">Schemas</h1>
        
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
        agentOptions={[]}
        showLatestOption={true}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Schemas</CardTitle>
        </CardHeader>
        <CardContent>
          <SchemaTable 
            filters={filters}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            onView={handleViewSchema}
            onEdit={handleEditSchema}
            onCreateNewVersion={handleCreateNewVersion}
          />
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <CreateSchemaDialog 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        newSchemaData={newSchemaData}
        setNewSchemaData={setNewSchemaData}
        nameOptions={nameOptions}
      />
      
      <ViewSchemaDialog 
        isOpen={isViewOpen} 
        onOpenChange={setIsViewOpen}
        schema={selectedSchema}
        onEdit={handleEditSchema}
      />
      
      <EditSchemaDialog 
        isOpen={isEditOpen} 
        onOpenChange={setIsEditOpen}
        schema={selectedSchema}
      />
      
      <NewVersionSchemaDialog 
        isOpen={isNewVersionOpen} 
        onOpenChange={setIsNewVersionOpen}
        schema={selectedSchema}
        newSchemaData={newSchemaData}
        setNewSchemaData={setNewSchemaData}
      />
    </div>
  );
};

export default Schemas;
