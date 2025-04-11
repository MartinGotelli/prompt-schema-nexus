
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Status } from "@/types";
import { statusOptions } from "@/lib/utils";

interface FormField {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: "input" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}

interface ResourceFormProps {
  fields: FormField[];
  onCancel: () => void;
  onSubmit: () => void;
  submitText: string;
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  fields,
  onCancel,
  onSubmit,
  submitText,
}) => {
  return (
    <>
      <div className="grid gap-4 py-4">
        {fields.map((field) => (
          <div key={field.id} className={field.className}>
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === "input" && (
              <Input
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className="mt-1"
              />
            )}
            {field.type === "textarea" && (
              <Textarea
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`${field.id.includes("template") ? "h-40 code-editor" : field.id.includes("definition") ? "h-60 json-viewer font-mono" : "h-20"}`}
              />
            )}
            {field.type === "select" && field.options && (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={field.disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>{submitText}</Button>
      </div>
    </>
  );
};

export default ResourceForm;
