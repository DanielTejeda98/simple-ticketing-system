"use client"

import { User as UserModel } from "@/app/models/userModel";
import { TableCell, TableRow } from "../ui/table";
import { Permissions } from "@/app/models/permissionsModel";

export default function UserRow ({user}: {user: UserModel} ) {
    return (
        <TableRow key={user._id!.toString()} onClick={() => window.location.href = `${window.location.origin}/users/${user._id}`} className="cursor-pointer">
            <TableCell>
                { user.firstName } { user.lastName }
            </TableCell>
            <TableCell>
                { user.email }
            </TableCell>
            <TableCell>
                {new Date(user.joined).toDateString()}
            </TableCell>
            <TableCell>
                { user.disabled ? "Disabled" : "Active" }
            </TableCell>
            <TableCell>
                { (user.access as Permissions)?.name || "No roles assigned" }
            </TableCell>
        </TableRow>
    )
}