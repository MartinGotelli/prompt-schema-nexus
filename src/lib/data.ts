
import { Prompt, Schema, Status } from "@/types";

// Mock data for demonstration purposes
const generateRandomVersion = (): string => {
  const major = Math.floor(Math.random() * 3);
  const minor = Math.floor(Math.random() * 10);
  const patch = Math.floor(Math.random() * 20);
  return `${major}.${minor}.${patch}`;
};

const statuses: Status[] = ["unstable", "draft", "stable", "deprecated"];
const members = ["john.doe", "jane.smith", "mike.johnson", "sarah.williams", "alex.brown"];
const agents = ["customer-support", "content-moderator", "data-analyst", "recommendation-engine", "qa-assistant"];
const promptTypes = ["qa", "summary", "extraction", "classification", "generation"];

export const mockPrompts: Prompt[] = Array.from({ length: 50 }, (_, i) => ({
  version: generateRandomVersion(),
  bump: ["major", "minor", "patch"][Math.floor(Math.random() * 3)] as any,
  status: statuses[Math.floor(Math.random() * statuses.length)],
  member: members[Math.floor(Math.random() * members.length)],
  type: promptTypes[Math.floor(Math.random() * promptTypes.length)],
  template: `This is a sample template for ${promptTypes[Math.floor(Math.random() * promptTypes.length)]} prompt. 
It contains variables like {{input}} and {{context}} that will be replaced with actual values.`,
  agent: agents[Math.floor(Math.random() * agents.length)]
}));

export const mockSchemas: Schema[] = Array.from({ length: 50 }, (_, i) => ({
  version: generateRandomVersion(),
  bump: ["major", "minor", "patch"][Math.floor(Math.random() * 3)] as any,
  status: statuses[Math.floor(Math.random() * statuses.length)],
  member: members[Math.floor(Math.random() * members.length)],
  name: [`customer-data`, `product-info`, `transaction-details`, `user-feedback`, `content-analysis`][Math.floor(Math.random() * 5)],
  definition: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      value: { type: "number" },
      tags: { 
        type: "array", 
        items: { type: "string" } 
      }
    },
    required: ["id", "name"]
  }
}));

// Utility functions for data manipulation
export const getUniqueValues = <T, K extends keyof T>(items: T[], key: K): T[K][] => {
  const values = items.map(item => item[key]);
  return [...new Set(values)];
};

export const getStatusCounts = <T extends { status: Status }>(items: T[]): Record<Status, number> => {
  return {
    unstable: items.filter(item => item.status === "unstable").length,
    draft: items.filter(item => item.status === "draft").length,
    stable: items.filter(item => item.status === "stable").length,
    deprecated: items.filter(item => item.status === "deprecated").length
  };
};
