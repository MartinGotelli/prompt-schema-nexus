
import React, { useMemo } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import StatusBadge from "@/components/ui/StatusBadge";
import { FilterOptions, Schema } from "@/types";
import { mockSchemas } from "@/lib/data";
import { compareVersions } from '@/lib/utils';
import { filterLatestVersions } from '@/lib/resource-utils';

interface SchemaTableProps {
  filters: FilterOptions;
  sortConfig: {key: string, direction: 'asc' | 'desc'} | null;
  setSortConfig: React.Dispatch<React.SetStateAction<{key: string, direction: 'asc' | 'desc'} | null>>;
  onView: (schema: Schema) => void;
  onEdit: (schema: Schema) => void;
  onCreateNewVersion: (schema: Schema) => void;
}

const SchemaTable: React.FC<SchemaTableProps> = ({
  filters,
  sortConfig,
  setSortConfig,
  onView,
  onEdit,
  onCreateNewVersion
}) => {
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
      filtered = filterLatestVersions(filtered, schema => schema.name);
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

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
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
                    <DropdownMenuItem onClick={() => onView(schema)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(schema)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateNewVersion(schema)}>Create New Version</DropdownMenuItem>
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
  );
};

export default SchemaTable;
