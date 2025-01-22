"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import RoleFormSchema from "./RoleFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { actions, AppAbility, subjects } from "@/app/lib/appAbility"
import { toSentenceCase } from "@/app/lib/utils"
import { Switch } from "../../ui/switch"
import { DeletePermission, NewPermission, UpdatePermission } from "@/app/server-actions/PermissionActions"
import { RawRuleOf } from "@casl/ability"

export default function RoleForm ({id, name, permissions}: {id?: string, name?: string, permissions?: RawRuleOf<AppAbility>[]}) {
    const { data } = useSession();
    const user = data!.user.id;
    const roleForm = useForm<z.infer<typeof RoleFormSchema>>({
        resolver: zodResolver(RoleFormSchema)
    })

    useEffect(() => {
        if (!permissions) {
            roleForm.setValue("creator", user);
            // Set form defaults
            subjects.forEach(subject => {
                actions.forEach(action => {
                    roleForm.setValue(`${subject}.${action}`, false);
                })
            })
            return;
        }

        roleForm.setValue("updator", user);
        roleForm.setValue("name", name || "");
        
        // Initiate all the values to false
        subjects.forEach(subject => {
            actions.forEach(action => {
                roleForm.setValue(`${subject}.${action}`, false);
            })
        })

        // Set the enabled permissions
        permissions.forEach(permission => {
            roleForm.setValue(`${permission.subject as typeof subjects[number]}.${permission.action as typeof actions[number]}`, true);
        })
        return;

    }, [roleForm, user,permissions, name])

    async function onSubmit(values: z.infer<typeof RoleFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = (permissions && id ? await UpdatePermission(id, values) : await NewPermission(values)) as Error;

        if (error) {
            roleForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = roleForm.formState.errors;

    return (
        <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onSubmit)} onInvalid={e => console.log(e)} className="space-y-8">
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
                    control={roleForm.control}
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
                                                control={roleForm.control}
                                                name={`${subject}.${action}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Switch checked={typeof field.value === "boolean" && field.value}
                                                            onCheckedChange={(e) => roleForm.setValue(`${subject}.${action}`, e)} />
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
                <div className="flex gap-2">
                    { id ? <Button type="button" variant={"destructive"} className="w-fit" onClick={() => DeletePermission(id)}>Remove permission</Button> : null}
                    <Button type="submit">{permissions ? "Save" : "Create role"}</Button>
                </div>
            </form>
        </Form>
    )
}