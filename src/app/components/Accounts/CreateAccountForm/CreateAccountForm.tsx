"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import CreateAccountFormSchema from "./CreateAccountFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { CreateUserAction } from "@/app/server-actions/CreateUserAction"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"

export default function CreateAccountForm ({ isInitialization = false}: { isInitialization?: boolean}) {
    const createAccountForm = useForm<z.infer<typeof CreateAccountFormSchema>>({
        resolver: zodResolver(CreateAccountFormSchema)
    })

    async function onSubmit(values: z.infer<typeof CreateAccountFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = await CreateUserAction(isInitialization, values) as Error;
        if (error) {

            createAccountForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = createAccountForm.formState.errors;

    return (
        <Form {...createAccountForm}>
            <form onSubmit={createAccountForm.handleSubmit(onSubmit)} className="space-y-8">
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
                <div className="flex w-full gap-3">
                    <FormField 
                        control={createAccountForm.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.firstName?.message ? 'text-destructive' : ''}>
                                    { errors?.firstName?.message ? errors.firstName.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={createAccountForm.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.lastName?.message ? 'text-destructive' : ''}>
                                    { errors?.lastName?.message ? errors.lastName.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>

                <FormField 
                    control={createAccountForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Sr. Developer" {...field}></Input>
                            </FormControl>
                        </FormItem>
                    )}>
                </FormField>

                <FormField 
                    control={createAccountForm.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="JohnDoe" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.username?.message ? 'text-destructive' : ''}>
                                { errors?.username?.message ? errors.username.message : "Username used to log in."}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <div className="flex w-full gap-3 flex-col md:flex-row">
                    <FormField 
                        control={createAccountForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe" type="password" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.password?.message ? 'text-destructive' : ''}>
                                    { errors?.password?.message ? errors.password.message : "Password used to log in."}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={createAccountForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe" type="password" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.confirmPassword?.message ? 'text-destructive' : ''}>
                                    { errors?.confirmPassword?.message ? errors.confirmPassword.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>
                
                <div className="flex w-full gap-3 flex-col md:flex-row">
                    <FormField 
                        control={createAccountForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe@gmail.com" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.email?.message ? 'text-destructive' : ''}>
                                    { errors?.email?.message ? errors.email.message : "Email associated to the account"}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={createAccountForm.control}
                        name="confirmEmail"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Confirm Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe@gmail.com" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.confirmEmail?.message ? 'text-destructive' : ''}>
                                    { errors?.confirmEmail?.message ? errors.confirmEmail.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>

                <Button type="submit">Create account</Button>
            </form>
        </Form>
    )
}