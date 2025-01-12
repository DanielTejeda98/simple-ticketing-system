import CreateAccountForm from "@/app/components/Accounts/CreateAccountForm/CreateAccountForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function InitializationApp () {
    return (
        <main className="flex flex-col gap-2 w-full h-dvh lg:flex-row">
            <div className="flex flex-col bg-blue-600 px-6 py-6 lg:w-1/3 lg:py-0">
                <div className="text-white h-[45%] mt-2">
                    <p>Simple Ticketing System</p>
                    <p>By Daniel Tejeda</p>
                </div>
                <div>
                    <h1 className="text-3xl text-white my-3">Let&apos;s setup your admin account</h1>
                    <p className="text-white">Your simple solution to ticketing for your clients</p>
                </div>
            </div>
            <div className="flex px-6 justify-center items-center lg:w-2/3">
                <div className="w-full mb-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Let&apos;s get started!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateAccountForm isInitialization></CreateAccountForm>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}