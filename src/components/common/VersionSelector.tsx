
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VersionSelectorProps {
  version: string;
  onChange: (version: string) => void;
  disabled?: boolean;
}

const VersionSelector: React.FC<VersionSelectorProps> = ({ 
  version, 
  onChange,
  disabled = false 
}) => {
  return (
    <div>
      <Label htmlFor="version">Version</Label>
      <Input 
        id="version" 
        value={version}
        onChange={(e) => onChange(e.target.value)}
        placeholder="1.0.0"
        disabled={disabled}
      />
    </div>
  );
};

export default VersionSelector;
