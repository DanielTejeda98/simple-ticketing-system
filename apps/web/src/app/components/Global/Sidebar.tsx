"use client"
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faGear, faDoorClosed, faHome } from '@fortawesome/free-solid-svg-icons'
import { Avatar, AvatarFallback, AvatarImage, MemoAvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Sidebar ({userAvatar}: {userAvatar: string}) {
    const { data } = useSession();

    if (!data) return null;
    const user = data.user!;

    return (
        <div className="flex bg-blue-600 border-b border-slate-200 px-2 py-3 justify-between md:flex-col md:h-dvh md:border-r md:border-b-0 sticky top-0">
            <div className="flex md:flex-col">
                <div className="hidden md:flex flex-col md:border-b md:pb-2">
                    <Button variant={"outline"}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>

                <div className="md:flex flex-col md:pt-2 text-white">
                    <Link href="/dashboard">
                        <Button variant={"ghost"}>
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
                    </Link>
                </div>

                <div className="hidden md:flex flex-col pt-2 text-white">
                    <Button variant={"ghost"}>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </div>
            </div>

            <div className="flex md:flex-col items-center gap-2">
                <Button variant={"ghost"} className="text-white">
                    <FontAwesomeIcon icon={faGear} />
                </Button>

                <Popover>
                    <PopoverTrigger>
                        <Avatar>
                            <AvatarImage src={userAvatar || ""}></AvatarImage>
                            <AvatarFallback>{user.firstName.substring(0,1)}{user.lastName.substring(0,1)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="ml-2">
                        <div className="flex gap-2 items-center border-b">
                            <Avatar>
                                <MemoAvatarImage src={userAvatar || ""}></MemoAvatarImage>
                                <AvatarFallback>{user.firstName.substring(0,1)}{user.lastName.substring(0,1)}</AvatarFallback>
                            </Avatar>

                            <div>
                                <p>
                                    {user.firstName} {user.lastName}
                                </p>
                                <p>
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-3">
                            <Button className="w-full">
                                <Link href={"/account/my-account"}><FontAwesomeIcon icon={faGear} /> User settings</Link>
                            </Button>

                            <Button className="w-full" variant={"destructive"} onClick={() => signOut()}>
                                <FontAwesomeIcon icon={faDoorClosed} /> Log out
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}