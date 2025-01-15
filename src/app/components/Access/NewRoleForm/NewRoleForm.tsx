"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import NewRoleFormSchema from "./NewRoleFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { actions, subjects } from "@/app/lib/appAbility"
import { toSentenceCase } from "@/app/lib/utils"
import { Switch } from "../../ui/switch"
import { NewPermission } from "@/app/server-actions/NewPermission"

export default function NewRoleForm () {
    const { data } = useSession();
    const user = data!.user.id;
    const newRoleForm = useForm<z.infer<typeof NewRoleFormSchema>>({
        resolver: async (data, context, options) => {
            // you can debug your validation schema here
            console.log("formData", data)
            console.log(
              "validation result",
              await zodResolver(NewRoleFormSchema)(data, context, options)
            )
            return zodResolver(NewRoleFormSchema)(data, context, options)
          }
    })

    useEffect(() => {
        newRoleForm.setValue("creator", user);
        // Set form defaults
        subjects.forEach(subject => {
            actions.forEach(action => {
                newRoleForm.setValue(`${subject}.${action}`, false);
            })
        })

    }, [newRoleForm, user])

    async function onSubmit(values: z.infer<typeof NewRoleFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = await NewPermission(values) as Error;

        if (error) {
            newRoleForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = newRoleForm.formState.errors;

    return (
        <Form {...newRoleForm}>
            <form onSubmit={newRoleForm.handleSubmit(onSubmit)} onInvalid={e => console.log(e)} className="space-y-8">
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
                    control={newRoleForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-1/2">
                            <FormLabel>Role name</FormLabel>
                            <FormControl>
                                <Input placeholder="User" {...field}></Input>
                            </FormControl>
                            <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                { errors?.name?.message ? errors.name.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resource Type</TableHead>
                            { actions.map(action => <TableHead key={action}>{toSentenceCase(action)}</TableHead>) }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { subjects.map(subject => {
                            return (
                                <TableRow key={subject}>
                                    <TableCell>{toSentenceCase(subject)}</TableCell>
                                    { actions.map(action => 
                                    (
                                        <TableHead key={`${subject}-${action}`}>
                                            <FormField 
                                                control={newRoleForm.control}
                                                name={`${subject}.${action}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Switch checked={typeof field.value === "boolean" && field.value}
                                                            onCheckedChange={(e) => newRoleForm.setValue(`${subject}.${action}`, e)} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}>
                                            </FormField>
                                        </TableHead>
                                    )
                                ) }
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                <Button type="submit">Create role</Button>
            </form>
        </Form>
    )
}