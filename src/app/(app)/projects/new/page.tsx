import NewProjectForm from "@/app/components/Projects/NewProjectForm/NewProjectForm";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default async function NewProjectPage () {
    

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">New Project</h1>
                <p className="text-lg md:text-xl text-transparent">Create a new project</p>
            </div>
            <Link href="/projects" className="my-3 w-fit"><Button type="button">Back to Projects</Button></Link>

            <NewProjectForm />

        </main>
    )
}