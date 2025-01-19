import Sidebar from "@/app/components/Global/Sidebar";
import AccessProvider from "@/app/providers/AccessProvider";
import AuthProvider from "@/app/providers/AuthProvier";
import { getInitialLoad } from "@/app/utils/getIntialLoad";

export default async function ErrorLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { props } = await getInitialLoad({});

    return (
        <AuthProvider session={props.session}>
          <AccessProvider permissions={props.permissions}>
            <div className="flex flex-col md:flex-row">
                <Sidebar userAvatar={props.userAvatar} />
                { children }
            </div>
          </AccessProvider>
        </AuthProvider>
    )
}