import Sidebar from "@/app/components/Global/Sidebar";
import AccessProvider from "@/app/providers/AccessProvider";
import AuthProvider from "@/app/providers/AuthProvier";
import { checkRouteAccess } from "@/app/utils/checkAbility";
import { getInitialLoad } from "@/app/utils/getIntialLoad";

export default async function ProjectsLayout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { props } = await getInitialLoad({});

    checkRouteAccess(props.permissions, "tickets");

    return (
        <AuthProvider session={props.session}>
          <AccessProvider permissions={props.permissions}>
            <div className="flex flex-col md:flex-row">
                <Sidebar userAvatar={props.userAvatar} />
                <aside className="hidden w-1/6 p-4 bg-blue-800 text-white md:flex flex-col gap-4">
                  <div>Project:</div> 
                  <div>Self Service</div>
                  <ul className="bg-blue-950 -mx-4 pl-8 pr-4 py-4 flex flex-col gap-4">
                      <li>Create New</li>
                      <li>Assigned to me</li>
                      <li>Open</li>
                      <li>Open - Unassigned</li>
                      <li>Resolved</li>
                      <li>All</li>
                  </ul>
              </aside>
                { children }
            </div>
          </AccessProvider>
        </AuthProvider>
    )
}