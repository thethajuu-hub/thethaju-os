"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveVisionEntry } from "@/app/(app)/vision/actions";
import type { VisionCategory } from "@/types";

export function VisionStatementCard({
  category,
  title,
  description,
  placeholder,
  content,
}: {
  category: VisionCategory;
  title: string;
  description: string;
  placeholder: string;
  content: string;
}) {
  const [value, setValue] = React.useState(content);
  const dirty = value !== content;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async () => {
            await saveVisionEntry(category, value);
          }}
          className="flex flex-col gap-3"
        >
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            rows={4}
          />
          <div className="flex items-center justify-end">
            <SaveButton dirty={dirty} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SaveButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant={dirty ? "primary" : "secondary"} loading={pending} disabled={!dirty && !pending}>
      {pending ? "Saving" : "Save"}
    </Button>
  );
}
