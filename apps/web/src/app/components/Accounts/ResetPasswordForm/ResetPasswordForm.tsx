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
import ResetPasswordFormSchema from "./ResetPasswordFormSchema"
import { ResetUserPassword } from "@/app/server-actions/ResetUserPassword"

export default function ResetPasswordForm () {
    const resetPasswordForm = useForm<z.infer<typeof ResetPasswordFormSchema>>({
        resolver: zodResolver(ResetPasswordFormSchema)
    })

    async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const token = window.location.pathname.split("/").at(-1) || "";
        const res = await ResetUserPassword(token, values);

        if (typeof res === "object" && !(res instanceof Error) && res?.errors) {
            resetPasswordForm.setError("root", {
                message: "There was an error"
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (typeof res === "object" && res instanceof Error && res?.message) {
            resetPasswordForm.setError("root", {
                message: res.message
            })
        }

        redirect("/?password-reset-successful");
    }

    const errors = resetPasswordForm.formState.errors;

    return (
        <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(onSubmit, (errors) => console.log(errors))} className="space-y-8 bg-white p-6 rounded-lg drop-shadow-md">
                <p>Use this form to reset your password.</p>
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
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="*****" type="password" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.password?.message ? 'text-destructive' : ''}>
                                { errors?.password?.message ? errors.password.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <FormField 
                    control={resetPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="*****" type="password" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.confirmPassword?.message ? 'text-destructive' : ''}>
                                { errors?.confirmPassword?.message ? errors.confirmPassword.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>

                <div className="flex flex-col gap-3">
                    <Button type="submit">Reset Password</Button>
                    <Link href="/">Login</Link>
                </div>
            </form>
        </Form>
    )
}