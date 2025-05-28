"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import NewTicketFormSchema from "./NewTicketFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "../../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import User from "../../Global/User";
import mongoose from "mongoose";
import { Textarea } from "../../ui/textarea";
import { User as UserModel } from "@/app/models/userModel";
import { Project } from "@/app/models/projectModel";
import { CreateTicketAction } from "@/app/server-actions/CreateTicket";
import { Button } from "../../ui/button";

export default function NewTicketForm({projects, resources}: { projects: Project[], resources: UserModel[]}) {
    const newTicketForm = useForm<z.infer<typeof NewTicketFormSchema>>({
        resolver: zodResolver(NewTicketFormSchema)
    })

    async function onSubmit(values: z.infer<typeof NewTicketFormSchema>) {
            // When successful, it will redirect the user, on error, it will return an error
            const error = await CreateTicketAction(values) as Error;
            if (error) {
                newTicketForm.setError("root", {
                    message: typeof error === "object" ? error.message : error
                })
    
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }

    const errors = newTicketForm.formState.errors;

    return (
        <Form {...newTicketForm}>
            <form onSubmit={newTicketForm.handleSubmit(onSubmit)} className="space-y-8">
                { errors?.root?.message ? (
                    <Alert variant={"destructive"}>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {errors.root.message}
                        </AlertDescription>
                    </Alert>
                ) : null }

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <FormField
                        control={newTicketForm.control}
                        name="number"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Ticket Number</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription className={errors?.number?.message ? "text-destructive" : ""}>
                                    { errors.number?.message ? errors.number?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={newTicketForm.control}
                        name="project"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Project</FormLabel>
                                <FormControl>
                                    <Select {...field}
                                            defaultValue={projects.length === 1 ? (projects[0]._id as mongoose.Types.ObjectId).toString() : ""}
                                            onValueChange={(e) => newTicketForm.setValue("project", e)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            { projects.map(project => (
                                                <SelectItem value={(project._id as mongoose.Types.ObjectId).toString()} key={(project._id as mongoose.Types.ObjectId).toString()}>
                                                    { project.name }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.project?.message ? "text-destructive" : ""}>
                                    { errors.project?.message ? errors.project?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={newTicketForm.control}
                        name="caller"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Caller</FormLabel>
                                <FormControl>
                                    <Select {...field} 
                                            onValueChange={(e) => newTicketForm.setValue("caller", e)}>
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
                                <FormDescription className={errors?.caller?.message ? "text-destructive" : ""}>
                                    { errors.caller?.message ? errors.caller?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={newTicketForm.control}
                        name="contactType"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Contact Type</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => newTicketForm.setValue("contactType", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select contact type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="self-service">Self Service</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="in-person">In-Person</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.contactType?.message ? "text-destructive" : ""}>
                                    { errors.contactType?.message ? errors.contactType?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField
                        control={newTicketForm.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={"new"}
                                            onValueChange={(e) => newTicketForm.setValue("state", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="on-hold">On Hold</SelectItem>
                                            <SelectItem value="work-completed">Work Completed</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.state?.message ? "text-destructive" : ""}>
                                    { errors.state?.message ? errors.state?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField
                        control={newTicketForm.control}
                        name="impact"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Impact</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => newTicketForm.setValue("impact", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select impact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - High</SelectItem>
                                            <SelectItem value="2">2 - Medium</SelectItem>
                                            <SelectItem value="3">3 - Low</SelectItem>
                                            <SelectItem value="4">4 - No Impact</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.impact?.message ? "text-destructive" : ""}>
                                    { errors.impact?.message ? errors.impact?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField
                        control={newTicketForm.control}
                        name="urgency"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Urgency</FormLabel>
                                <FormControl>
                                    <Select {...field}
                                            onValueChange={(e) => newTicketForm.setValue("urgency", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select urgency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - High</SelectItem>
                                            <SelectItem value="2">2 - Medium</SelectItem>
                                            <SelectItem value="3">3 - Low</SelectItem>
                                            <SelectItem value="4">4 - No Urgency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.urgency?.message ? "text-destructive" : ""}>
                                    { errors.urgency?.message ? errors.urgency?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField
                        control={newTicketForm.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => newTicketForm.setValue("priority", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Critical</SelectItem>
                                            <SelectItem value="2">2 - High</SelectItem>
                                            <SelectItem value="3">3 - Medium</SelectItem>
                                            <SelectItem value="4">4 - Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.priority?.message ? "text-destructive" : ""}>
                                    { errors.priority?.message ? errors.priority?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={newTicketForm.control}
                        name="assignedTo"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Assigned To</FormLabel>
                                <FormControl>
                                    <Select {...field} 
                                            onValueChange={(e) => newTicketForm.setValue("assignedTo", e)}>
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
                                <FormDescription className={errors?.assignedTo?.message ? "text-destructive" : ""}>
                                    { errors.assignedTo?.message ? errors.assignedTo?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField
                        control={newTicketForm.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => newTicketForm.setValue("category", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="google-workspace">Google Workspace</SelectItem>
                                            <SelectItem value="website">Website</SelectItem>
                                            <SelectItem value="google-business">Google Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription className={errors?.category?.message ? "text-destructive" : ""}>
                                    { errors.category?.message ? errors.category?.message : null }
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>
                <FormField
                    control={newTicketForm.control}
                    name="shortDescription"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Short Description</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription className={errors?.shortDescription?.message ? "text-destructive" : ""}>
                                { errors.shortDescription?.message ? errors.shortDescription?.message : null }
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>
                
                <FormField
                    control={newTicketForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormDescription className={errors?.description?.message ? "text-destructive" : ""}>
                                { errors.description?.message ? errors.description?.message : null }
                            </FormDescription>
                        </FormItem>
                    )}>
                </FormField>

                <div className="flex gap-2 mt-8">
                    <Button type="submit" className="w-fit">Create ticket</Button>
                </div>
            </form>
        </Form>
    )
}