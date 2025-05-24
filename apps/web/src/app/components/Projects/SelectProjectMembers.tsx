import { Project } from "@/app/models/projectModel";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User as UserModel } from "@/app/models/userModel";
import User from "../Global/User";
import mongoose from "mongoose";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Popover, PopoverContentNoPortal, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

interface SelectProjectMembersProps {
    project: Project,
    resources: UserModel[],
    value: string[],
    disabled?: boolean,
    onAddMember: (userId: string) => void,
    onRemoveMember: (userId: string) => void
}

type Role = "Project Owner" | "Lead Resource" | "Member";

const getProjectRole = (user: UserModel, project: Project): Role => {
    if ((user._id as mongoose.Types.ObjectId).toString() === project.owningClient) {
        return "Project Owner"
    } else if ((user._id as mongoose.Types.ObjectId).toString() === project.leadResource) {
        return "Lead Resource"
    } else {
        return "Member"
    }
}

const getBadgeText = (user: UserModel, project: Project) => {
    switch (getProjectRole(user, project)) {
        case "Project Owner":
            return "Project Owner"
        case "Lead Resource":
            return "Lead Resource"
        case "Member":
            return ""
    }
}

const sortList = (a: UserModel, b: UserModel, project: Project) => {
    const aRole = getProjectRole(a, project);
    const bRole = getProjectRole(b, project);
    if (aRole === bRole) {
        return a.firstName.localeCompare(b.firstName);
    } else if (aRole === "Project Owner") {
        return -1;
    } else if (bRole === "Project Owner") {
        return 1;
    } else if (aRole === "Lead Resource") {
        return -1;
    } else {
        return 1;
    }
}

const canBeRemoved = (user: UserModel, project: Project): boolean => {
    return getProjectRole(user, project) === "Member";
}

export default function SelectProjectMembers({project, resources, value, disabled = false, onAddMember, onRemoveMember}: SelectProjectMembersProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const projectMembers = resources.filter(resource => value?.includes((resource._id as mongoose.Types.ObjectId).toString())).sort((a, b) => sortList(a, b, project));
    const unassignedResources = resources.filter(resource => !value?.includes((resource._id as mongoose.Types.ObjectId).toString()))

    function addMember (userId: string) {
        onAddMember(userId);
        setPopoverOpen(false);
    }

    return (
        <Dialog>
            <DialogTrigger className="w-fit" asChild>
                <Button type="button" disabled={disabled}>Open Member Management</Button>
            </DialogTrigger>
            <DialogContent id="user-management-dialog">
                <DialogHeader>
                    <DialogTitle>{project.name} user management</DialogTitle>
                </DialogHeader>
                <DialogDescription>User management for the project. Assign and remove users.</DialogDescription>
                <div>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" className="w-fit">Add User</Button>
                        </PopoverTrigger>
                        <PopoverContentNoPortal align="start">
                            <Command>
                                <CommandInput placeholder="Search for users..." value={searchUser} onInput={e => setSearchUser(e.currentTarget.value)} className="z-50"/>
                                <CommandList>
                                    <CommandEmpty>No users.</CommandEmpty>
                                    <CommandGroup>
                                        {unassignedResources.map((user) => (
                                            <CommandItem key={user._id as string} onSelect={() => addMember(user._id as string)} className="flex justify-between cursor-pointer">
                                                <ProjectMemberListItem user={user} canRemove={false} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContentNoPortal>
                    </Popover>
                    <h2>Assigned Members</h2>
                    <hr className="mb-1"></hr>
                    <ul className="flex flex-col gap-1 overflow-y-auto max-height-[80svh]">
                        {
                            projectMembers.map(pm => <ProjectMemberListItem key={pm._id as string} user={pm} badgeText={getBadgeText(pm, project)} canRemove={canBeRemoved(pm, project)} remove={onRemoveMember}/>)
                        }
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ProjectMemberListItem ({user, badgeText, canRemove, remove}: {user: UserModel, canRemove: boolean, badgeText?: string, remove?: (userId: string) => void}) {
    return (
        <li className="flex w-full justify-between border rounded-md p-1">
            <div className="flex flex-col gap-1">
                <User user={user} onlyName /> 
                {badgeText && <Badge className="w-fit">{badgeText}</Badge>}
            </div>
            {canRemove && remove && <Button variant={"destructive"} type="button" onClick={() => remove(user._id as string)}>Remove</Button>}
        </li>
    )
}