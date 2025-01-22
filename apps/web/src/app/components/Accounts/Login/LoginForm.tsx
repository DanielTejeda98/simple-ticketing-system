"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import LoginFormSchema from "./LoginFormSchema"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"

export default function LoginForm () {
    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema)
    })

    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        
        const res = await signIn("credentials", {
            providedIdentifier: values.providedIdentifier,
            password: values.password,
            redirect: false
        })

        if (res?.error) {
            
            loginForm.setError("root", {
                message: res.status === 401 ? "Username and Password do not match any accounts" : res.error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (window.location.search) {
            const redirectUrl = new URL(window.location.toString()).searchParams.get("callbackUrl");
            if (redirectUrl) redirect(redirectUrl);
            else redirect("/dashboard");
        } else {
            redirect("/dashboard");
        }
    }

    const errors = loginForm.formState.errors;

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg drop-shadow-md">
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
                    control={loginForm.control}
                    name="providedIdentifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username or Email</FormLabel>
                            <FormControl>
                                <Input placeholder="John or JohnDoe@gmail.com" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.providedIdentifier?.message ? 'text-destructive' : ''}>
                                { errors?.providedIdentifier?.message ? errors.providedIdentifier.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <FormField 
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="JohnDoe" type="password" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.password?.message ? 'text-destructive' : ''}>
                                { errors?.password?.message ? errors.password.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <div className="flex flex-col gap-3">
                    <Button type="submit">Sign in</Button>
                    <Button type="button" variant={"outline"} onClick={() => signIn("google")}><FontAwesomeIcon icon={faGoogle}/>Sign in with Google</Button>
                    <div className="flex flex-wrap w-full justify-between">
                        <Link href="/account/create" className="w-full xl:w-auto">Create an account</Link>
                        <Link href="/account/forgot-password" className="w-full xl:w-auto">Forgot password?</Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}