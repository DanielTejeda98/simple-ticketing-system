import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type DisplayUser = {
    firstName: string,
    lastName: string,
    email: string,
    title: string
}

export default function User ({user}: {user: DisplayUser}) {
    return (
        <div className="flex gap-2 items-center">
            <Avatar>
                <AvatarImage></AvatarImage>
                <AvatarFallback>{user.firstName.substring(0,1)}{user.lastName.substring(0,1)}</AvatarFallback>
            </Avatar>

            <div>
                <p>
                    {user.firstName} {user.lastName}
                </p>
                <p>
                    {user.email}
                </p>
                <p>
                    {user.title}
                </p>
            </div>
        </div>
    )
}