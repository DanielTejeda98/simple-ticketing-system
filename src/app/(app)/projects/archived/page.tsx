import ProjectsTableRow from "@/app/components/Projects/ProjectsTableRow/ProjectsTableRow";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAllArchivedProjects } from "@/app/controllers/projectController";
import Link from "next/link";

export default async function ProjectsPage () {
    const projects = await getAllArchivedProjects();

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Archived Projects</h1>
                <p className="text-lg md:text-xl text-transparent">See all the archived projects</p>
            </div>
            <Link href="/projects" className="my-3 w-fit"><Button>Return to projects</Button></Link>
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