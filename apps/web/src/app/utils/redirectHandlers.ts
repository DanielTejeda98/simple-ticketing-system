import { redirect } from "next/navigation";

export function handleUnathorized () {
    redirect("/error/401");
}

export function handleNotFound () {
    redirect("/error/404");
}