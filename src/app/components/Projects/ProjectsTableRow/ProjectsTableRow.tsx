"use client"

import { Project } from "@/app/models/projectModel"
import { TableCell, TableRow } from "../../ui/table"
import User from "../../Global/User"
import { User as UserModel} from "@/app/models/userModel"

export default function ProjectsTableRow ({project}: {project: Project}) {
    
    return (
        <TableRow key={project._id!.toString()} onClick={() => window.location.href = `${window.location.origin}/projects/${project.slug}`} className="cursor-pointer">
            <TableCell>
                { project.name }
            </TableCell>
            <TableCell>{ project.slug }</TableCell>
            <TableCell className="w-fit">
                { project.description}
            </TableCell>
            <TableCell>{ project.boughtWorkHours - project.totalWorkedHours }</TableCell>
            <TableCell>
                { project.leadResource ? 
                <User user={project.leadResource as UserModel}/>
                : <User user={{firstName: "Unassigned", lastName: "", email: "", title: ""}}/> }
            </TableCell>
        </TableRow>
    )
} 