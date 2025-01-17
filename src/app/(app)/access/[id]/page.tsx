import RoleForm from "@/app/components/Access/RoleForm/RoleForm";
import { Button } from "@/app/components/ui/button";
import { getPermission } from "@/app/controllers/permissionsController";
import Link from "next/link";

export default async function EditRolePage ({ params }: { params: Promise<{ id: string}>}) {
    const { id } = await params;
    const permission = await getPermission(id);

    if (!permission) return null;
    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">{permission.name}</h1>
            </div>
            <Link href="/access" className="my-3 w-fit"><Button type="button">Back to Access</Button></Link>

            <RoleForm id={id} name={permission.name} permissions={JSON.parse(permission.permissions)}/>

        </main>
    )
}