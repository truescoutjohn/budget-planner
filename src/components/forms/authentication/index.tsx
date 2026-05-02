"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { BaseForm } from "@/components/forms/general/form";
import { loginSchema, registrationSchema } from "@/schema/zod";
import registration from "@/actions/registration";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";

async function onSubmitLogin(
  values: z.infer<typeof loginSchema>,
  router: ReturnType<typeof useRouter>,
  loginForm: UseFormReturn<z.infer<typeof loginSchema>>,
) {
  loginForm.clearErrors();
  const result = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: false,
  });

  if (result?.error) {
    loginForm.setError("email", {
      type: "server",
      message: String(result.error),
    });
    return;
  } else {
    router.push("/home");
    router.refresh();
  }
}

async function onSubmitRegistrationForm(
  values: z.infer<typeof registrationSchema>,
  router: ReturnType<typeof useRouter>,
  registerForm: UseFormReturn<z.infer<typeof registrationSchema>>,
) {
  registerForm.clearErrors();
  const result = await registration(
    values.email,
    values.password,
    values.confirmPassword,
  );

  if (result?.error) {
    registerForm.setError("email", {
      type: "server",
      message: String(result.error),
    });
    return;
  }

  router.push("/");
  router.refresh();
}

const AuthForm = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <Tabs.List className="grid w-full grid-cols-2">
          <Tabs.Trigger value="login">Login</Tabs.Trigger>
          <Tabs.Trigger value="register">Register</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="login">
          <Card>
            <Card.Header>
              <Card.Title>Sign In</Card.Title>
              <Card.Description>
                Enter your credentials to access your account
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <BaseForm
                schema={loginSchema}
                defaultValues={{ email: "", password: "" }}
                className="space-y-4"
                onSubmit={(values, form) => onSubmitLogin(values, router, form)}
              >
                {(form) => (
                  <>
                    <Form.Field
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Email</Form.Label>
                          <Form.Control>
                            <Input.Root
                              placeholder="example@mail.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                    <Form.Field
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Password</Form.Label>
                          <Form.Control>
                            <Input.Root
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </>
                )}
              </BaseForm>
            </Card.Content>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="register">
          <Card>
            <Card.Header>
              <Card.Title>Create Account</Card.Title>
              <Card.Description>
                Fill in the details below to register
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <BaseForm
                schema={registrationSchema}
                defaultValues={{ email: "", password: "", confirmPassword: "" }}
                className="space-y-4"
                onSubmit={(values, form) =>
                  onSubmitRegistrationForm(values, router, form)
                }
              >
                {(form) => (
                  <>
                    <Form.Field
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Email</Form.Label>
                          <Form.Control>
                            <Input.Root
                              placeholder="example@mail.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                    <Form.Field
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Password</Form.Label>
                          <Form.Control>
                            <Input.Root
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                    <Form.Field
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <Form.Item>
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control>
                            <Input.Root
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              value={field.value || ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </>
                )}
              </BaseForm>
            </Card.Content>
          </Card>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default AuthForm;
