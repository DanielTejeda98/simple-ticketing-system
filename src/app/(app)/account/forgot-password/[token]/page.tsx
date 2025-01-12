import ResetPasswordForm from "@/app/components/Accounts/ResetPasswordForm/ResetPasswordForm";
import { isValidResetToken } from "@/app/controllers/userController";
import AuthProvider from "@/app/providers/AuthProvier";
import { getInitialLoad } from "@/app/utils/getIntialLoad";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Account ({ params }: { params: { token: string }}) {
  const { token } = await params;  
  const { props } = await getInitialLoad({});
    let isValidToken = false;
    try {
      isValidToken = await isValidResetToken(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Continue
    }

    if (props.session) {
        redirect("/dashboard");
    }
    
    return (
        <AuthProvider session={props.session}>
          <main className="flex flex-col justify-center items-center bg-blue-600 w-full h-dvh">
            <div className="flex flex-col gap-3 min-w-[25%] px-3">
              <div className="flex flex-col text-white">
                <h1 className="text-2xl font-bold">Simple Ticket System</h1>
                <p>By Daniel Tejeda</p>
              </div>
              { isValidToken ? <ResetPasswordForm /> : 
              <div className="flex flex-col space-y-8 bg-white p-6 rounded-lg drop-shadow-md">
                <p>The provided token is either exipred or invalid. <br />If you think you are seeing this by mistake, please attempt again by requesting a new password reset token.</p>
                <Link href="/">Return to Login</Link>
              </div>}
              
            </div>
          </main>
        </AuthProvider>
    )
}