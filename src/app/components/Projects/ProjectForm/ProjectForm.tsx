"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import ProjectFormSchema from "./ProjectFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { Project } from "@/app/models/projectModel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { User as UserModel } from "@/app/models/userModel"
import mongoose from "mongoose"
import User from "../../Global/User"
import { useSession } from "next-auth/react"
import { UpdateProjectAction } from "@/app/server-actions/UpdateProject"
import { useEffect } from "react"

export default function ProjectForm ({ project, resources }: { project: Project, resources: UserModel[] }) {
    const { data } = useSession();
    const projectForm = useForm<z.infer<typeof ProjectFormSchema>>({
        resolver: zodResolver(ProjectFormSchema)
    })

    useEffect(() => {
        projectForm.setValue("name", project.name);
        projectForm.setValue("description", project.description);
        projectForm.setValue("boughtWorkHours", project.boughtWorkHours);
        projectForm.setValue("leadResource", project.leadResource?.toString());
        projectForm.setValue("slug", project.slug);
        projectForm.setValue("updater", data!.user!.id);
    }, [project, data, projectForm])

    async function onSubmit(values: z.infer<typeof ProjectFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = await UpdateProjectAction(values) as Error;
        if (error) {

            projectForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = projectForm.formState.errors;

    return (
        <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit(onSubmit)} className="flex mt-8">
                <div className="flex flex-col w-2/3">
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
                        control={projectForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Project name</FormLabel>
                                <FormControl>
                                    <Input defaultValue={project.name} {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                    { errors?.name?.message ? errors.name.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={projectForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-1/2">
                                <FormLabel>Project description</FormLabel>
                                <FormControl>
                                    <Input defaultValue={project.description} {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.description?.message ? 'text-destructive' : ''}>
                                    { errors?.description?.message ? errors.description.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    
                    <div className="flex">
                        <FormField 
                            control={projectForm.control}
                            name="boughtWorkHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Total Hours Purchased</FormLabel>
                                    <FormControl>
                                        <Input type="number" defaultValue={project.boughtWorkHours} 
                                         {...field}
                                         onChange={(e) => projectForm.setValue("boughtWorkHours", Number(e.target.value))}
                                         min={0}></Input>
                                    </FormControl>
                                    <FormDescription className={ errors?.boughtWorkHours?.message ? 'text-destructive' : ''}>
                                        { errors?.boughtWorkHours?.message ? errors.boughtWorkHours.message : null}
                                    </FormDescription>
                                </FormItem>
                            )}>
                        </FormField>
                        <Button className="mt-8 ml-2" type="button" variant={"outline"} onClick={() => projectForm.setValue("boughtWorkHours", (projectForm.getValues("boughtWorkHours") || 0) + 5)}>Add 5 Hours</Button>
                        <Button className="mt-8 ml-2" type="button" variant={"outline"} onClick={() => projectForm.setValue("boughtWorkHours", (projectForm.getValues("boughtWorkHours") || 0) + 10)}>Add 10 Hours</Button>
                    </div>
                    
                    <Button type="submit" className="w-fit">Save project</Button>
                </div>
                
                <div className="flex flex-col w-1/3 gap-2">
                <FormField 
                    control={projectForm.control}
                    name="leadResource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assigned Resource Lead</FormLabel>
                            <FormControl>
                                <Select defaultValue={project.leadResource?.toString()} {...field} onValueChange={(e) => projectForm.setValue("leadResource", e)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        { resources.map(resource => (
                                            <SelectItem value={(resource._id as mongoose.Types.ObjectId).toString()} key={(resource._id as mongoose.Types.ObjectId).toString()}>
                                                <User user={resource} onlyName></User>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription className={ errors?.description?.message ? 'text-destructive' : ''}>
                                { errors?.description?.message ? errors.description.message : null}
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <div className="space-y-2 w-1/2 border rounded p-2 w-full">
                    <p className="text-sm font-medium leading-none">Remaining Hours/Owed Hours</p>
                    <p>{project.boughtWorkHours - project.totalWorkedHours}</p>
                </div>

                <div className="space-y-2 w-1/2 border rounded p-2 w-full">
                    <p className="text-sm font-medium leading-none">Total Completed Work Hours</p>
                    <p>{project.totalWorkedHours}</p>
                </div>
                
                </div>
            </form>
        </Form>
    )
}