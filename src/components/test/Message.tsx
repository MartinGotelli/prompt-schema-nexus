
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  role: 'user' | 'assistant';
  content?: string;
  extractedData?: Record<string, any>;
  showExtractedDataExpanded?: boolean;
}

export const Message: React.FC<MessageProps> = ({ 
  role, 
  content, 
  extractedData,
  showExtractedDataExpanded = false
}) => {
  if (role === 'user') {
    return (
      <div className="ml-auto">
        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm max-w-[80%]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 mr-auto">
      {content && (
        <div className="bg-muted rounded-lg px-3 py-2 text-sm max-w-[80%]">
          {content}
        </div>
      )}
      {extractedData && (
        <Collapsible defaultOpen={showExtractedDataExpanded} className="w-[80%]">
          <div className="bg-muted rounded-lg px-3 py-2 text-sm">
            <CollapsibleTrigger className="flex items-center gap-2 w-full">
              <ChevronDown className="h-4 w-4" />
              <span className="font-medium">Extracted Data</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="whitespace-pre-wrap break-words mt-2 font-mono">
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
    </div>
  );
};
