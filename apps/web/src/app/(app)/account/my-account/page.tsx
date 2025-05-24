import AuthProvider from "@/app/providers/AuthProvier";
import { getInitialLoad } from "@/app/utils/getIntialLoad";

export default async function Account () {
    const { props } = await getInitialLoad({});
    
    return (
        <AuthProvider session={props.session}>
            <>Hi from account!</>
        </AuthProvider>
    )
}