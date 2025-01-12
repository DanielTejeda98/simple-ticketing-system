"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { redirect } from "next/navigation"
import Link from "next/link"
import ForgotPasswordFormSchema from "./ForgotPasswordFormSchema"
import { RequestUserPasswordReset } from "@/app/server-actions/RequestUserPasswordReset"

export default function ForgotPasswordForm () {
    const forgotPasswordForm = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
        resolver: zodResolver(ForgotPasswordFormSchema)
    })

    async function onSubmit(values: z.infer<typeof ForgotPasswordFormSchema>) {
        const error = await RequestUserPasswordReset(values) as Error;

        if (error) {
            forgotPasswordForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        redirect("/?password-request-sent");
    }

    const errors = forgotPasswordForm.formState.errors;

    return (
        <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg drop-shadow-md">
            <p>Use this form to submit a request for a password reset to your account email.</p>
                { errors?.root?.message 
                ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errors.root.message}
                        </AlertDescription>
                    </Alert>
                )
                : null}
                <FormField 
                    control={forgotPasswordForm.control}
                    name="providedIdentification"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe or JohnDoe@gmail.com" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.providedIdentification?.message ? 'text-destructive' : ''}>
                                { errors?.providedIdentification?.message ? errors.providedIdentification.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <div className="flex flex-col gap-3">
                    <Button type="submit">Submit Request</Button>
                    <Link href="/">Login</Link>
                </div>
            </form>
        </Form>
    )
}