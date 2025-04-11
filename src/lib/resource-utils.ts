
import { Status, Prompt, Schema } from "@/types";
import { compareVersions, getNextPatchVersion, formatJson } from "@/lib/utils";
import { toast } from "sonner";

// Common function to find latest version
export const findLatestVersion = <T extends { version: string }>(items: T[], filterFn: (item: T) => boolean): string => {
  const filteredItems = items.filter(filterFn);
  if (filteredItems.length === 0) return "1.0.0";
  
  return filteredItems
    .sort((a, b) => compareVersions(b.version, a.version))[0].version;
};

// Common function to filter latest versions
export const filterLatestVersions = <T extends { version: string }>(
  items: T[],
  getKey: (item: T) => string
): T[] => {
  const latestVersions = new Map<string, T>();
  
  items.forEach(item => {
    const key = getKey(item);
    const current = latestVersions.get(key);
    
    if (!current || compareVersions(item.version, current.version) > 0) {
      latestVersions.set(key, item);
    }
  });
  
  return Array.from(latestVersions.values());
};

// Common function for handling resource actions
export const handleResourceAction = (
  action: string,
  resourceType: "Prompt" | "Schema", 
  resourceName: string,
  closeDialogs: () => void
): void => {
  toast.success(`${resourceType} ${action} successfully`, {
    description: `${resourceType} ${resourceName} has been ${action}.`,
  });
  
  closeDialogs();
};

// Get default form data for a new resource
export const getDefaultFormData = (resourceType: "prompt" | "schema"): any => {
  if (resourceType === "prompt") {
    return {
      type: "",
      agent: "",
      version: "1.0.0",
      template: "",
      isNewType: false,
      owner: "",
      status: "unstable" as Status
    };
  } else {
    return {
      name: "",
      version: "1.0.0",
      definition: "{}",
      isNewName: false,
      owner: "",
      status: "unstable" as Status
    };
  }
};
