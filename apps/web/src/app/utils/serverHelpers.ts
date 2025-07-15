import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";

export const checkAuthAndGetUserId = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error("Must be signed in for this action");
    }

    return session.user.id;
}