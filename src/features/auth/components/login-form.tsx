'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LOGIN_MUTATION, LoginData, LoginVars } from '../graphql/queries';
import { createAuthSession } from '../actions/auth-actions';
import { IconLoader2 } from '@tabler/icons-react';

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long.' }),
});

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const [loginUser, { loading }] = useMutation<LoginData, LoginVars>(LOGIN_MUTATION);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setServerError(null);
    try {
      const result = await loginUser({
        variables: { input: values },
      });

      const token = result.data?.login.accessToken;

      if (token) {
        // Use the server action to set the secure cookie
        await createAuthSession(token);
        // Redirect to the dashboard upon successful login
        router.push('/dashboard');
        router.refresh(); // Refresh to update server-side state
      } else {
        setServerError('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setServerError(error.message || 'An unexpected error occurred.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <p className="text-sm font-medium text-destructive">{serverError}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </Form>
  );
}