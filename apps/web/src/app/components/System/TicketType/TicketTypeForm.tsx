"use client";

import { useForm } from "react-hook-form"
import { TicketTypeFormSchema } from "./TicketTypeFormSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { Input } from "../../ui/input";
import { createNewTicketType } from "@/app/server-actions/TicketTypeActions";
import { Button } from "../../ui/button";
import { redirect } from "next/navigation";

export default function SystemsTicketTypeForm() {
    const ticketTypeForm = useForm<z.infer<typeof TicketTypeFormSchema>>({
        defaultValues: {
            name: "",
            identifier: "",
            description: ""
        },
        resolver: zodResolver(TicketTypeFormSchema)
    });
    const errors = ticketTypeForm.formState.errors;

    async function onSubmit(values: z.infer<typeof TicketTypeFormSchema>) {
        let isSuccess = false;
        try {
            isSuccess = await createNewTicketType(values);
        } catch (error: unknown) {
            const _error = error as Error;
            ticketTypeForm.setError("root", {
                message: _error.message,
            })
    
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (isSuccess) redirect("/system/ticket-types");
    }
    return (
        <Form {...ticketTypeForm}>
            <form onSubmit={ticketTypeForm.handleSubmit(onSubmit)} className="flex mt-8">
                <div className="flex flex-col w-1/4">
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
                        control={ticketTypeForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Type name</FormLabel>
                                <FormControl>
                                    <Input {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                    { errors?.name?.message ? errors.name.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={ticketTypeForm.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Type Identifier</FormLabel>
                                <FormControl>
                                    <Input {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                    { errors?.name?.message ? errors.name.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>

                    <FormField 
                        control={ticketTypeForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Type description</FormLabel>
                                <FormControl>
                                    <Input {...field}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.name?.message ? 'text-destructive' : ''}>
                                    { errors?.name?.message ? errors.name.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                    <Button type="submit" className="w-fit">Save ticket type</Button>
                </div>
            </form>
        </Form>
    )
}