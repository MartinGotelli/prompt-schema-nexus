
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Status } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Compare versions helper function
export const compareVersions = (v1: string, v2: string) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  
  return 0;
};

// Get suggested next version
export const getNextPatchVersion = (version: string) => {
  const parts = version.split('.');
  const patch = parseInt(parts[2] || '0') + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
};

// Format JSON helper
export const formatJson = (json: any): string => {
  return JSON.stringify(json, null, 2);
};

// Status options
export const statusOptions: Status[] = ["unstable", "draft", "stable", "deprecated"];
