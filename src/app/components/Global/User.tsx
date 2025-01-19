import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type DisplayUser = {
    firstName: string,
    lastName: string,
    email: string,
    title: string,
    avatar: string
}

export default function User ({user, onlyName}: {user: DisplayUser, onlyName?: boolean}) {
    return (
        <div className="flex gap-2 items-center">
            <Avatar>
                <AvatarImage src={user.avatar || ""}></AvatarImage>
                <AvatarFallback>{user.firstName.substring(0,1)}{user.lastName.substring(0,1)}</AvatarFallback>
            </Avatar>

            <div>
                <p>
                    {user.firstName} {user.lastName}
                </p>
                {
                    !onlyName 
                    ? (
                        <>
                            <p>
                                {user.email}
                            </p>
                            <p>
                                {user.title}
                            </p>
                        </>
                    ) : null
                }
                
            </div>
        </div>
    )
}