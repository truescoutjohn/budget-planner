"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";

type BaseFormProps<TValues extends FieldValues> = Omit<
  React.ComponentPropsWithoutRef<"form">,
  "children" | "onSubmit"
> & {
  schema: z.ZodType<TValues>;
  defaultValues?: Partial<TValues>;
  onSubmit: (
    values: TValues,
    form: UseFormReturn<TValues>,
  ) => void | Promise<void>;
  children:
    | React.ReactNode
    | ((form: UseFormReturn<TValues>) => React.ReactNode);
};

export function BaseForm<TValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  ...formProps
}: BaseFormProps<TValues>) {
  const form = useForm<TValues, any, TValues>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: defaultValues as never,
  });

  return (
    <Form {...form}>
      <form
        {...formProps}
        onSubmit={form.handleSubmit((values) => onSubmit(values, form))}
      >
        {typeof children === "function" ? children(form) : children}
      </form>
    </Form>
  );
}
