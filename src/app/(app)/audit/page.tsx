import User from "@/app/components/Global/User";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAudits } from "@/app/controllers/auditController";
import { User as UserModel } from "@/app/models/userModel";
import mongoose from "mongoose";

export default async function AuditPage () {
    type Log = {
        _id: mongoose.Types.ObjectId,
        who: UserModel,
        what: string,
        toWhom: UserModel,
        data: string,
        timestamp: Date
    }
    const auditLogs = await getAudits() as Log[];

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Audit logs</h1>
                <p className="text-lg md:text-xl text-transparent">Monitor any changes made to the system</p>
            </div>

            <Table>
                <TableCaption>List of audit logs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Affected</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Timestamp</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        auditLogs.map(log => (
                            <TableRow key={log._id!.toString()} >
                                <TableCell>
                                { log.who 
                                    ? <User user={log.who} />
                                    : null}
                                </TableCell>
                                <TableCell>{ log.what }</TableCell>
                                <TableCell>
                                    { log.toWhom 
                                    ? <User user={log.toWhom} />
                                    : null}
                                </TableCell>
                                <TableCell>{ log.data }</TableCell>
                                <TableCell>
                                    <div>
                                        <p>{ log.timestamp?.toLocaleDateString() }</p>
                                        <p className="text-xs text-slate-500">{ log.timestamp?.toLocaleTimeString()}</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </main>
    )
}