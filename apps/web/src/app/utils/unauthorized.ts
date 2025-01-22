import { redirect } from "next/navigation";

export default function handleUnathorized () {
    redirect("/error/401");
}