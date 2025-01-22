import ProjectsTableRow from "@/app/components/Projects/ProjectsTableRow/ProjectsTableRow";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAllProjects } from "@/app/controllers/projectController";
import Link from "next/link";

export default async function ProjectsPage () {
    const projects = await getAllProjects();

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Projects</h1>
                <p className="text-lg md:text-xl text-transparent">Manage projects and assign users to their projects</p>
            </div>
            <div className="flex w-full justify-between">
                <Link href="/projects/new" className="my-3 w-fit"><Button>Create new project</Button></Link>
                <Link href="/projects/archived" className="my-3 w-fit"><Button variant={"outline"}>View Archived Projects</Button></Link>
            </div>
            <Table>
                <TableCaption>List of projects</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Available Work Hours</TableHead>
                        <TableHead>Lead Resource</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        projects.map(project => (
                            <ProjectsTableRow key={project.slug} project={JSON.parse(JSON.stringify(project))} />
                        ))
                    }
                </TableBody>
            </Table>
        </main>
    )
}