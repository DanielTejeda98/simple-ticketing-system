"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import EditUserFormSchema from "./EditUserFormSchema"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../../ui/form"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert"
import { Permissions } from "@/app/models/permissionsModel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import mongoose from "mongoose"
import { User } from "@/app/models/userModel"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { UploadPicture } from "@/app/server-actions/UploadPicture"
import { UpdateUserActionFromManagement } from "@/app/server-actions/UpdateUser"

export default function EditUserForm ({ user, permissions }: {user: User, permissions: Permissions[], isUserManagement?: boolean}) {
    const editUserForm = useForm<z.infer<typeof EditUserFormSchema>>({
        resolver: zodResolver(EditUserFormSchema)
    })

    const { data } = useSession();
    const [ pictureUploading, setPictureUploading] = useState(false);

    useEffect(() => {
        editUserForm.setValue("id", (user._id as mongoose.Types.ObjectId).toString());
        editUserForm.setValue("firstName", user.firstName);
        editUserForm.setValue("lastName", user.lastName);
        editUserForm.setValue("title", user.title);
        editUserForm.setValue("email", user.email);
        editUserForm.setValue("access", ((user.access as Permissions)?._id as mongoose.Types.ObjectId)?.toString());
        editUserForm.setValue("updater", data!.user!.id);
        editUserForm.setValue("avatar", user.avatar);
    }, [user, editUserForm, data])

    async function uploadPicture (picture: File[]) {
        try {
            setPictureUploading(true);
            const imageName = await UploadPicture(picture);
            editUserForm.setValue("avatar", imageName);
            setPictureUploading(false);
        } catch (error) {
            console.log(error);
            editUserForm.setError("root", {
                message: "An error occured when uploading the Avatar"
            })
        }
    }

    async function onSubmit(values: z.infer<typeof EditUserFormSchema>) {
        // When successful, it will redirect the user, on error, it will return an error
        const error = await UpdateUserActionFromManagement(values) as Error;
        if (error) {

            editUserForm.setError("root", {
                message: typeof error === "object" ? error.message : error
            })

            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    const errors = editUserForm.formState.errors;

    return (
        <Form {...editUserForm}>
            <form onSubmit={editUserForm.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
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
                <div className="flex w-full items-center gap-3 justify-center">
                    <Avatar className="h-40 w-40">
                        <AvatarImage src={editUserForm.getValues("avatar")}></AvatarImage>
                        <AvatarFallback className="text-5xl">{user.firstName.substring(0,1)}{user.lastName.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <FormField 
                        control={editUserForm.control}
                        name="avatar"
                        render={() => (
                            <FormItem className="w-1/4">
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/png, image/jpeg" onInput={e => uploadPicture(e.currentTarget.files)} disabled={pictureUploading}></Input>
                                </FormControl>
                                <FormDescription className={ errors?.avatar?.message ? 'text-destructive' : ''}>
                                    { errors?.avatar?.message ? errors.avatar.message : null}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>
                <div className="flex w-full gap-3">
                    <FormField 
                        control={editUserForm.control}
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
                        control={editUserForm.control}
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
                    control={editUserForm.control}
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
                
                <div className="flex w-full gap-3 flex-col md:flex-row">
                    <FormField 
                        control={editUserForm.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>New Password?</FormLabel>
                                <FormControl>
                                    <Input placeholder="JohnDoe" type="password" {...field} autoComplete="off"></Input>
                                </FormControl>
                                <FormDescription className={ errors?.newPassword?.message ? 'text-destructive' : ''}>
                                    { errors?.newPassword?.message ? errors.newPassword.message : "Password used to log in."}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>
                
                <div className="flex w-full gap-3 flex-col md:flex-row">
                    <FormField 
                        control={editUserForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="md:w-1/2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="JohnDoe@gmail.com" {...field} autoComplete="off"></Input>
                                </FormControl>
                                <FormDescription className={ errors?.email?.message ? 'text-destructive' : ''}>
                                    { errors?.email?.message ? errors.email.message : "Email associated to the account"}
                                </FormDescription>
                            </FormItem>
                        )}>
                    </FormField>
                </div>
                <FormField
                    control={editUserForm.control}
                    name="access"
                    render={({field}) => (
                        <FormControl>
                            <Select defaultValue={((user.access as Permissions)?._id as mongoose.Types.ObjectId)?.toString()}
                                    {...field} 
                                    onValueChange={(e) => editUserForm.setValue("access", e)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="No role" />
                                </SelectTrigger>
                                <SelectContent>
                                        <SelectItem value={null} key={"no-value"}>
                                            No role
                                        </SelectItem>
                                    { permissions.map(perm => (
                                        <SelectItem value={(perm._id as mongoose.Types.ObjectId).toString()} key={(perm._id as mongoose.Types.ObjectId).toString()}>
                                            { perm.name }
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    )}>
                </FormField>

                <Button type="submit">Update account</Button>
            </form>
        </Form>
    )
}