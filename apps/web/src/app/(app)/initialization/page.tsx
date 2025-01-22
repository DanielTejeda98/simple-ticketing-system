import { getInitialLoad } from "../../utils/getIntialLoad";
import { Metadata } from "next";
import InitializationApp from "./Intitialization";
import AuthProvider from "@/app/providers/AuthProvier";

export const metadata: Metadata = {
  title: "Get Started | Simple Ticketing System"
}

export default async function Initialization () {
    const { props } = await getInitialLoad({skipCheckInitialization: true});

    return (
        <AuthProvider session={props.session}>
            <InitializationApp></InitializationApp>
        </AuthProvider>
    )
}