"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import NewProjectFormSchema from "./NewProjectFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { CreateProjectAction } from "@/app/server-actions/CreateProject"

export default function NewProjectForm () {
    const newProjectForm = useForm<z.infer<typeof NewProjectFormSchema>>({
        resolver: zodResolver(NewProjectFormSchema)
    })

    async function onSubmit(values: z.infer<typeof NewProjectFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = await CreateProjectAction(values) as Error;
        if (error) {

            newProjectForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = newProjectForm.formState.errors;

    return (
        <Form {...newProjectForm}>
            <form onSubmit={newProjectForm.handleSubmit(onSubmit)} className="space-y-8">
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
                        control={newProjectForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Project name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Excalibur" {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                    { errors?.name?.message ? errors.name.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                <Button type="submit">Create project</Button>
            </form>
        </Form>
    )
}