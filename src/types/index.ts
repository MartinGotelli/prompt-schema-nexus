
export type VersionBump = "major" | "minor" | "patch";

export type Status = "unstable" | "draft" | "stable" | "deprecated";

export interface BaseVersioned {
  version: string;
  bump: VersionBump;
  status: Status;
  member: string;
  owner?: string; // Add optional owner field
}

export interface Prompt extends BaseVersioned {
  type: string;
  template: string;
  agent: string;
}

export interface Schema extends BaseVersioned {
  name: string;
  definition: Record<string, any>;
}

export interface FilterOptions {
  search: string;
  status?: Status[];
  member?: string[];
  agent?: string[];
  type?: string[];
  latestOnly?: boolean; // Add filter for latest versions only
}
