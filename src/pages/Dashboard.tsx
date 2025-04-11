
import React, { useState } from 'react';
import { BookText, FileJson, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/ui/StatsCard";
import StatusBadge from "@/components/ui/StatusBadge";
import FilterBar from "@/components/ui/FilterBar";
import { FilterOptions, Status } from "@/types";
import { mockPrompts, mockSchemas, getUniqueValues, getStatusCounts } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    agent: [],
    type: []
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

  // Get statistics
  const promptStatusCounts = getStatusCounts(filteredPrompts);
  const schemaStatusCounts = getStatusCounts(filteredSchemas);

  // Prepare data for charts
  const statusColors = {
    unstable: "#FFA726",
    draft: "#42A5F5",
    stable: "#66BB6A",
    deprecated: "#EF5350",
  };

  const statusData = [
    { name: "Unstable", prompts: promptStatusCounts.unstable, schemas: schemaStatusCounts.unstable },
    { name: "Draft", prompts: promptStatusCounts.draft, schemas: schemaStatusCounts.draft },
    { name: "Stable", prompts: promptStatusCounts.stable, schemas: schemaStatusCounts.stable },
    { name: "Deprecated", prompts: promptStatusCounts.deprecated, schemas: schemaStatusCounts.deprecated },
  ];

  const promptPieData = Object.entries(promptStatusCounts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: statusColors[key as Status],
  }));

  const schemaPieData = Object.entries(schemaStatusCounts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    color: statusColors[key as Status],
  }));

  // Options for filtering
  const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
  const memberOptions = getUniqueValues(mockPrompts.concat(mockSchemas as any), "member");
  const agentOptions = getUniqueValues(mockPrompts, "agent");
  const typeOptions = getUniqueValues(mockPrompts, "type");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Manager Dashboard</h1>
      
      <FilterBar
        onFilterChange={setFilters}
        statusOptions={statusOptions}
        memberOptions={memberOptions}
        agentOptions={agentOptions}
        typeOptions={typeOptions}
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Total Prompts"
          value={filteredPrompts.length}
          icon={BookText}
          description="Active prompts in the system"
        />
        <StatsCard
          title="Total Schemas"
          value={filteredSchemas.length}
          icon={FileJson}
          description="Active schemas in the system"
        />
        <StatsCard
          title="Stable Resources"
          value={promptStatusCounts.stable + schemaStatusCounts.stable}
          icon={CheckCircle}
          description="Stable prompts and schemas"
        />
      </div>

      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="details">Detailed Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Resource Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="prompts" name="Prompts" fill="#3B82F6" />
                    <Bar dataKey="schemas" name="Schemas" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prompts by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={promptPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.name}
                      >
                        {promptPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Schemas by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={schemaPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={(entry) => entry.name}
                      >
                        {schemaPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
