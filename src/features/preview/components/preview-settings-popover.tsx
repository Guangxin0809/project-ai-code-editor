"use client";

import z from "zod";
import { useState } from "react";
import { SettingsIcon } from "lucide-react";
import { useForm } from "@tanstack/react-form";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useUpdateProjectSettings
} from "@/features/projects/hooks/use-projects";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Field,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  installCommand: z.string(),
  devCommand: z.string(),
});

type Props = {
  projectId: Id<"projects">;
  initialValues?: Doc<"projects">["settings"];
  onSave?: () => void;
}

export const PreviewSettingsPopover = ({
  projectId,
  initialValues,
  onSave,
}: Props) => {

  const [open, setOpen] = useState(false);
  const updateSettings = useUpdateProjectSettings();

  const form = useForm({
    defaultValues: {
      installCommand: initialValues?.installCommand ?? "",
      devCommand: initialValues?.devCommand ?? "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await updateSettings({
        id: projectId,
        settings: {
          installCommand: value.installCommand || undefined,
          devCommand: value.devCommand || undefined,
        },
      });

      setOpen(false);
      onSave?.();
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        installCommand: initialValues?.installCommand ?? "",
        devCommand: initialValues?.devCommand ?? "",
      });
    }

    setOpen(isOpen);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          title="Preview settings"
          className="h-full rounded-none"
        >
          <SettingsIcon size={12} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80">
        <form onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}>
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="font-medium text-sm">
                Preview Settings
              </h4>
              <p className="text-xs text-muted-foreground">
                Configure how your project runs in the preview.
              </p>
            </div>

            <form.Field name="installCommand">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Install Command
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="npm install"
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    Command to install dependencies
                  </FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Field name="devCommand">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Start Command
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="npm run dev"
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>
                    Command to start the development server
                  </FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Saving..." : "save Changes"}
                  </Button>
                )}
            </form.Subscribe>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
