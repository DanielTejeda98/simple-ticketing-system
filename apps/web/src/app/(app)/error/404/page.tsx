"use client"
import { Button } from "@/app/components/ui/button";

export default function NotFound () {
    return (
        <main>
            <div className="text-red-500 px-4 md:px-8 mt-6 md:mt-[10vh] max-h-fit">
                <h1 className="text-2xl md:text-4xl">Resource not found</h1>
                <p className="text-lg md:text-xl">It looks like no resource was found at this URL. If you believe the URL is correct, please contact your admin as you might not have permissions to see the resource.</p>
            </div>
            <Button className="mx-4 md:mx-8" onClick={() => history.back()}>Back</Button>
        </main>
    )
}