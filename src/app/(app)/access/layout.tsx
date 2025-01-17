import Sidebar from "@/app/components/Global/Sidebar";
import AuthProvider from "@/app/providers/AuthProvier";
import { checkRouteAccess } from "@/app/utils/checkAbility";
import { getInitialLoad } from "@/app/utils/getIntialLoad";

export default async function AuditLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { props } = await getInitialLoad({});

    checkRouteAccess(props.permissions, "permissions");

    return (
        <AuthProvider session={props.session}>
            <div className="flex flex-col md:flex-row">
                <Sidebar />
                { children }
            </div>
        </AuthProvider>
    )
}