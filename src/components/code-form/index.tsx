'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Button,
} from '@/components';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSocket } from '@/stores';
import React from 'react';

interface CodeFormProps {
  error?: string;
  setError?: (error: string) => void;
}

const formSchema = z.object({
  code: z
    .string()
    .min(6, 'Код должен содержать 6 цифр')
    .max(6, 'Код должен содержать 6 цифр'),
});

type FormValues = z.infer<typeof formSchema>;

export const CodeForm = ({ error, setError }: CodeFormProps) => {
  const [socket, getClientId] = useSocket((state) => [
    state.socket,
    state.getClientId,
  ]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  const verifyCode = React.useCallback(
    (data: FormValues) => {
      socket?.emit('user:verifyCode', {
        code: data.code,
        clientId: getClientId(),
      });
    },
    [socket],
  );

  const onSubmit = (data: FormValues) => verifyCode(data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 grid w-full">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  onFocus={() => setError && setError('')}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
              {error && (
                <div className="text-destructive text-[0.8rem] font-semibold">
                  {error}
                </div>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-5">
          Отправить
        </Button>
      </form>
    </Form>
  );
};
