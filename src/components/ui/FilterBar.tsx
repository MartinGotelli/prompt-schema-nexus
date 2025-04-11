
import React, { useState, useEffect } from "react";
import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterOptions, Status } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import StatusBadge from "./StatusBadge";

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  statusOptions: Status[];
  memberOptions: string[];
  agentOptions?: string[];
  typeOptions?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  statusOptions,
  memberOptions,
  agentOptions = [],
  typeOptions = [],
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: [],
    member: [],
    agent: [],
    type: [],
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleStatusToggle = (status: Status) => {
    setFilters((prev) => {
      const newStatus = prev.status || [];
      return {
        ...prev,
        status: newStatus.includes(status)
          ? newStatus.filter((s) => s !== status)
          : [...newStatus, status],
      };
    });
  };

  const handleMemberToggle = (member: string) => {
    setFilters((prev) => {
      const newMembers = prev.member || [];
      return {
        ...prev,
        member: newMembers.includes(member)
          ? newMembers.filter((m) => m !== member)
          : [...newMembers, member],
      };
    });
  };

  const handleAgentToggle = (agent: string) => {
    setFilters((prev) => {
      const newAgents = prev.agent || [];
      return {
        ...prev,
        agent: newAgents.includes(agent)
          ? newAgents.filter((a) => a !== agent)
          : [...newAgents, agent],
      };
    });
  };

  const handleTypeToggle = (type: string) => {
    setFilters((prev) => {
      const newTypes = prev.type || [];
      return {
        ...prev,
        type: newTypes.includes(type)
          ? newTypes.filter((t) => t !== type)
          : [...newTypes, type],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: [],
      member: [],
      agent: [],
      type: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={filters.status && filters.status.length > 0 ? "bg-accent" : ""}
              >
                Status
                {filters.status && filters.status.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-xs text-primary-foreground w-5 h-5 flex items-center justify-center">
                    {filters.status.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <Command>
                <CommandInput placeholder="Filter status..." />
                <CommandList>
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {statusOptions.map((status) => {
                      const isSelected = filters.status?.includes(status);
                      return (
                        <CommandItem
                          key={status}
                          onSelect={() => handleStatusToggle(status)}
                        >
                          <div
                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                              isSelected ? "bg-primary border-primary" : ""
                            }`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <StatusBadge status={status} />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Member Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={filters.member && filters.member.length > 0 ? "bg-accent" : ""}
              >
                Member
                {filters.member && filters.member.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-xs text-primary-foreground w-5 h-5 flex items-center justify-center">
                    {filters.member.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <Command>
                <CommandInput placeholder="Filter members..." />
                <CommandList>
                  <CommandEmpty>No members found.</CommandEmpty>
                  <CommandGroup>
                    {memberOptions.map((member) => {
                      const isSelected = filters.member?.includes(member);
                      return (
                        <CommandItem
                          key={member}
                          onSelect={() => handleMemberToggle(member)}
                        >
                          <div
                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                              isSelected ? "bg-primary border-primary" : ""
                            }`}
                          >
                            {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span>{member}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Agent Filter (Only show if agents are provided) */}
          {agentOptions.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={filters.agent && filters.agent.length > 0 ? "bg-accent" : ""}
                >
                  Agent
                  {filters.agent && filters.agent.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary text-xs text-primary-foreground w-5 h-5 flex items-center justify-center">
                      {filters.agent.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Filter agents..." />
                  <CommandList>
                    <CommandEmpty>No agents found.</CommandEmpty>
                    <CommandGroup>
                      {agentOptions.map((agent) => {
                        const isSelected = filters.agent?.includes(agent);
                        return (
                          <CommandItem
                            key={agent}
                            onSelect={() => handleAgentToggle(agent)}
                          >
                            <div
                              className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                                isSelected ? "bg-primary border-primary" : ""
                              }`}
                            >
                              {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span>{agent}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Type Filter (Only show if types are provided) */}
          {typeOptions.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={filters.type && filters.type.length > 0 ? "bg-accent" : ""}
                >
                  Type
                  {filters.type && filters.type.length > 0 && (
                    <span className="ml-2 rounded-full bg-primary text-xs text-primary-foreground w-5 h-5 flex items-center justify-center">
                      {filters.type.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Filter types..." />
                  <CommandList>
                    <CommandEmpty>No types found.</CommandEmpty>
                    <CommandGroup>
                      {typeOptions.map((type) => {
                        const isSelected = filters.type?.includes(type);
                        return (
                          <CommandItem
                            key={type}
                            onSelect={() => handleTypeToggle(type)}
                          >
                            <div
                              className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                                isSelected ? "bg-primary border-primary" : ""
                              }`}
                            >
                              {isSelected && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span>{type}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {/* Reset Filters */}
          {(filters.search || 
            (filters.status && filters.status.length > 0) || 
            (filters.member && filters.member.length > 0) || 
            (filters.agent && filters.agent.length > 0) || 
            (filters.type && filters.type.length > 0)) && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9">
              <XIcon className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
