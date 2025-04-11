
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Status } from "@/types";
import { statusOptions } from "@/lib/utils";

interface StatusSelectorProps {
  status: Status;
  onChange: (status: Status) => void;
  disabled?: boolean;
}

const StatusSelector: React.FC<StatusSelectorProps> = ({ 
  status, 
  onChange,
  disabled = false 
}) => {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select 
        value={status}
        onValueChange={(value) => onChange(value as Status)}
        disabled={disabled}
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
  );
};

export default StatusSelector;
