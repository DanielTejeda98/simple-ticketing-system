import CreateAccountForm from "@/app/components/Accounts/CreateAccountForm/CreateAccountForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import AuthProvider from "@/app/providers/AuthProvier";
import { getInitialLoad } from "@/app/utils/getIntialLoad";
import Link from "next/link";

export default async function CreateAccount () {
    const { props } = await getInitialLoad({});
    
    return (
        <AuthProvider session={props.session}>
            <main className="flex flex-col items-center bg-blue-600 w-full min-h-fit h-dvh">
                <div className="flex flex-col gap-3 min-w-[50%] px-3 mt-5">
                    <div className="flex flex-col text-white">
                        <h1 className="text-2xl font-bold">Simple Ticketing System</h1>
                        <p>By Daniel Tejeda</p>
                    </div>
                    <div className="w-full mb-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Let&apos;s get started!</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col">
                                <CreateAccountForm></CreateAccountForm>
                                <Link href="/" className="mt-2">Return to login</Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
           
        </AuthProvider>
    )
}