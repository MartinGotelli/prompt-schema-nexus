
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
import { FilterOptions, Prompt } from "@/types";
import { mockPrompts } from "@/lib/data";
import { compareVersions } from '@/lib/utils';
import { filterLatestVersions } from '@/lib/resource-utils';

interface PromptTableProps {
  filters: FilterOptions;
  sortConfig: {key: string, direction: 'asc' | 'desc'} | null;
  setSortConfig: React.Dispatch<React.SetStateAction<{key: string, direction: 'asc' | 'desc'} | null>>;
  onView: (prompt: Prompt) => void;
  onEdit: (prompt: Prompt) => void;
  onCreateNewVersion: (prompt: Prompt) => void;
}

const PromptTable: React.FC<PromptTableProps> = ({
  filters,
  sortConfig,
  setSortConfig,
  onView,
  onEdit,
  onCreateNewVersion
}) => {
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
      filtered = filterLatestVersions(filtered, prompt => `${prompt.type}-${prompt.agent}`);
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
                    <DropdownMenuItem onClick={() => onView(prompt)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(prompt)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateNewVersion(prompt)}>Create New Version</DropdownMenuItem>
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
  );
};

export default PromptTable;
