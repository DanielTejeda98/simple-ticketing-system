import ProjectForm from "@/app/components/Projects/ProjectForm/ProjectForm";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { getProject } from "@/app/controllers/projectController";
import { getAllUsers } from "@/app/controllers/userController";
import { Project } from "@/app/models/projectModel";
import { User } from "@/app/models/userModel";
import mongoose from "mongoose";
import Link from "next/link";

export default async function Project ({ params }: { params: Promise<{ id: string}>}) {
    const { id } = await params;
    const retrievedProject = await getProject(id) as Project;
    const retrievedUsers = await getAllUsers() as User[]

    if (!retrievedProject) return null;
    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">{retrievedProject.name}</h1>
                <p className="text-lg md:text-xl text-transparent">{retrievedProject.description}</p>
            </div>
            <Badge className="w-fit">ID: {(retrievedProject._id as mongoose.Types.ObjectId).toString()}</Badge>
            <Link href="/projects" className="my-3"><Button>Back to projects</Button></Link>
            <div>
                <ProjectForm project={JSON.parse(JSON.stringify(retrievedProject))} resources={JSON.parse(JSON.stringify(retrievedUsers))}/>
            </div>
        </main>
    )
}