"use client"

import { Permissions } from "@/app/models/permissionsModel";
import { TableCell, TableRow } from "../ui/table";
import { User as UserModel} from "@/app/models/userModel"
import User from "../Global/User";

export default function AccessRow ({role}: {role: Permissions}) {
    return (
        <TableRow key={role._id!.toString()} onClick={() => window.location.href = `${window.location.origin}/access/${role._id}`} className="cursor-pointer">
            <TableCell>
                { role.name }
            </TableCell>
            <TableCell>
                { role.assignedUsersCount || 0 }
            </TableCell>
            <TableCell>
                <User user={(role.updatedBy || role.createdBy) as UserModel} />
            </TableCell>
        </TableRow>
    )
}