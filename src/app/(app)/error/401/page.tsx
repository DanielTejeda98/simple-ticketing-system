"use client"
import { Button } from "@/app/components/ui/button";

export default function Unauthorized () {
    return (
        <main>
            <div className="text-red-500 px-4 md:px-8 mt-6 md:mt-[10vh] max-h-fit">
                <h1 className="text-2xl md:text-4xl">Unauthroized Request</h1>
                <p className="text-lg md:text-xl">It looks like you do not have the permissions to access this resource, if you believe you should have access please contact your admin.</p>
            </div>
            <Button className="mx-4 md:mx-8" onClick={() => history.back()}>Back</Button>
        </main>
    )
}