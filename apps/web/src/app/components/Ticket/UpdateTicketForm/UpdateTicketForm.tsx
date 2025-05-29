"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import UpdateTicketFormSchema from "./UpdateTicketSchema";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Ticket } from "@/app/models/ticketModel";
import RichtextEditor from "../../ui/rich-text-input";

export default function UpdateTicketForm({ticket, projects, resources}: { ticket: Ticket, projects: Project[], resources: UserModel[]}) {
    const { data } = useSession();
    const userId = (data && data.user.id!) || "";
    
    const updateTicketForm = useForm<z.infer<typeof UpdateTicketFormSchema>>({
        resolver: zodResolver(UpdateTicketFormSchema),
        defaultValues: {
            number: ticket.number,
            project: (ticket.project as Project)._id.toString(),
            caller: ticket.caller ? (ticket.caller as UserModel)._id.toString() : "",
            contactType: ticket.contactType,
            state: ticket.state,
            impact: ticket.impact,
            urgency: ticket.urgency,
            priority: ticket.priority,
            assignedTo: ticket.assignedTo ? (ticket.assignedTo as UserModel)._id.toString() : "",
            category: ticket.category,
            shortDescription: ticket.shortDescription,
            description: ticket.description,
            notes: ticket.notes?.map(note => note && {
                ...note,
                createdAt: note.createdAt instanceof Date ? note.createdAt.toISOString() : note.createdAt,
                updatedAt: note.updatedAt instanceof Date ? note.updatedAt.toISOString() : note.updatedAt,
            }),
            attachments: ticket.attachments?.map(att => att && ({
                ...att,
                createdAt: att.createdAt instanceof Date ? att.createdAt.toISOString() : att.createdAt,
            })),
            resolutionInformation: {
                resolutionSummary: ticket.resolutionInformation?.resolutionSummary || ""
            }
        }
    })
    const [newNote, setNewNote] = useState("");

    async function onSubmit(values: z.infer<typeof UpdateTicketFormSchema>) {
            // When successful, it will redirect the user, on error, it will return an error
            const error = await CreateTicketAction(values) as Error;
            if (error) {
                updateTicketForm.setError("root", {
                    message: typeof error === "object" ? error.message : error
                })
    
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }

    const errors = updateTicketForm.formState.errors;

    return (
        <Form {...updateTicketForm}>
            <form onSubmit={updateTicketForm.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex gap-2 mt-8">
                    <Button type="submit" className="w-fit">Update ticket</Button>
                </div>
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
                        control={updateTicketForm.control}
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
                        control={updateTicketForm.control}
                        name="project"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Project</FormLabel>
                                <FormControl>
                                    <Select {...field}
                                            defaultValue={projects.length === 1 ? (projects[0]._id as mongoose.Types.ObjectId).toString() : ""}
                                            onValueChange={(e) => updateTicketForm.setValue("project", e)}>
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
                        control={updateTicketForm.control}
                        name="caller"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Caller</FormLabel>
                                <FormControl>
                                    <Select {...field} 
                                            onValueChange={(e) => updateTicketForm.setValue("caller", e)}>
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
                        control={updateTicketForm.control}
                        name="contactType"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Contact Type</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => updateTicketForm.setValue("contactType", e)}>
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
                        control={updateTicketForm.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={"new"}
                                            onValueChange={(e) => updateTicketForm.setValue("state", e)}>
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
                        control={updateTicketForm.control}
                        name="impact"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Impact</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => updateTicketForm.setValue("impact", e)}>
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
                        control={updateTicketForm.control}
                        name="urgency"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Urgency</FormLabel>
                                <FormControl>
                                    <Select {...field}
                                            onValueChange={(e) => updateTicketForm.setValue("urgency", e)}>
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
                        control={updateTicketForm.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => updateTicketForm.setValue("priority", e)}>
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
                        control={updateTicketForm.control}
                        name="assignedTo"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Assigned To</FormLabel>
                                <FormControl>
                                    <Select {...field} 
                                            onValueChange={(e) => updateTicketForm.setValue("assignedTo", e)}>
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
                        control={updateTicketForm.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Select {...field} defaultValue={field.value}
                                            onValueChange={(e) => updateTicketForm.setValue("category", e)}>
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
                    control={updateTicketForm.control}
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
                    control={updateTicketForm.control}
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

                <Tabs>
                    <TabsList>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="attachments">Attachments</TabsTrigger>
                        <TabsTrigger value="resolution">Resolution</TabsTrigger>
                    </TabsList>
                    <TabsContent value="notes" defaultValue={"notes"}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Notes</h3>
                            <FormField
                                control={updateTicketForm.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div>
                                                {/* <Textarea
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Add a note..."
                                                    className="resize-none"
                                                    key={"note-textarea"}
                                                /> */}
                                                <RichtextEditor onChange={(editorState) => {
                                                    console.log("Editor state changed", editorState);
                                                }} />
                                                <Button type="button" className="mt-2" onClick={() => {
                                                    if (newNote.trim() === "") return;
                                                    const notes = field.value || [];
                                                    notes.push({
                                                        user: userId,
                                                        content: newNote,
                                                        createdAt: new Date().toISOString(),
                                                        updatedAt: new Date().toISOString()
                                                    });
                                                    field.onChange(notes);
                                                    setNewNote("");
                                                }
                                                }>Add Note</Button>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}>
                            </FormField>
                            {updateTicketForm.getValues("notes")?.map((note, index) => {
                                const user = resources.find(r => r._id === note.user);
                                const displayName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
                                return (
                                    <div key={index} className="p-4 border rounded-md">
                                        <p><strong>{displayName}</strong> - {new Date(note.createdAt).toLocaleString()}</p>
                                        <p>{note.content}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>
                    <TabsContent value="attachments">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Attachments</h3>
                            <p>Attachments functionality is not implemented yet.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="resolution">
                        <FormField
                            control={updateTicketForm.control}
                            name="resolutionInformation.resolutionSummary"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Resolution Summary</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription className={errors?.resolutionInformation?.resolutionSummary?.message ? "text-destructive" : ""}>
                                        { errors?.resolutionInformation?.resolutionSummary?.message ? errors.resolutionInformation.resolutionSummary.message : null }
                                    </FormDescription>
                                </FormItem>
                            )}>
                        </FormField>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}