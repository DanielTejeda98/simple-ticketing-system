import { getAllPermissions } from "@/app/controllers/permissionsController";
import { getUser } from "@/app/controllers/userController";
import { User } from "@/app/models/userModel";
import { Permissions } from "@/app/models/permissionsModel";
import EditUserView from "./EditUserView";

export default async function EditUser ({ params }: { params: Promise<{ id: string}>}) {
    const { id } = await params;
    const retrievedUser = await getUser(id) as User
    const roles = await getAllPermissions() as Permissions[];

    if (!retrievedUser) return null;
    return <EditUserView retrievedUser={JSON.parse(JSON.stringify(retrievedUser))} roles={JSON.parse(JSON.stringify(roles))} />
}