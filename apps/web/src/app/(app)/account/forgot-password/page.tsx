import ForgotPasswordForm from "@/app/components/Accounts/ForgotPasswordForm/ForgotPasswordForm";
import AuthProvider from "@/app/providers/AuthProvier";
import { getInitialLoad } from "@/app/utils/getIntialLoad";
import { redirect } from "next/navigation";

export default async function ForgotPassword () {
    const { props } = await getInitialLoad({});

    if (props.session) {
        redirect("/dashboard");
    }
    
    return (
        <AuthProvider session={props.session}>
            <main className="flex flex-col justify-center items-center bg-blue-600 w-full h-dvh">
                    <div className="flex flex-col gap-3 min-w-[25%] px-3">
                      <div className="flex flex-col text-white">
                        <h1 className="text-2xl font-bold">Simple Ticketing System</h1>
                        <p>By Daniel Tejeda</p>
                      </div>
                      <ForgotPasswordForm />
                    </div>
                  </main>
        </AuthProvider>
    )
}