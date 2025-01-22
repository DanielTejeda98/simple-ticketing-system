"use server"

import { writeFile } from "fs/promises";
import path from "path";

export async function UploadPicture (picture: File[]) {
    if (!picture || !picture.at(0)) {
        throw new Error("No file found");
    }
    const buffer = Buffer.from(await picture.at(0)!.arrayBuffer());
    const filename = `${crypto.randomUUID()}.${picture.at(0)?.type.split("/").at(1)}`;

    try {
        await writeFile(
            path.join(process.cwd(), "public", "assets", "users", filename),
            buffer
        )

        return `/assets/users/${filename}`;
    } catch (error) {
       throw error; 
    }
}