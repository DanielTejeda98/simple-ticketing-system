"use client"
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faGear, faDoorClosed } from '@fortawesome/free-solid-svg-icons'
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { signOut } from "next-auth/react";

export default function Sidebar () {
    return (
        <div className="flex flex-col h-dvh bg-blue-600 border-r border-slate-200 px-2 py-3 justify-between">
            <div className="flex flex-col">
                <div className="flex flex-col border-b pb-2">
                    <Button variant={"outline"}>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                </div>

                <div className="flex flex-col pt-2 text-white">
                    <Button variant={"ghost"}>
                        <FontAwesomeIcon icon={faSearch} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <Button variant={"ghost"} className="text-white">
                    <FontAwesomeIcon icon={faGear} />
                </Button>

                <Popover>
                    <PopoverTrigger>
                        <Avatar>
                            <AvatarImage></AvatarImage>
                            <AvatarFallback>DT</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="ml-2">
                        <div className="flex gap-2 items-center border-b">
                            <Avatar>
                                <AvatarImage></AvatarImage>
                                <AvatarFallback>DT</AvatarFallback>
                            </Avatar>

                            <div>
                                <p>
                                    Daniel Tejeda
                                </p>
                                <p>
                                    daviddan1998@gmail.com
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-3">
                            <Button className="w-full">
                                <FontAwesomeIcon icon={faGear} /> User settings
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