/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, SessionStrategy } from "next-auth";
import dbConnect from "@/app/utils/dbConnect";
import { hash, verify } from "@/app/utils/passwordHasher";
import userModel from "@/app/models/userModel";
import Google, { GoogleProfile } from "next-auth/providers/google";
import generateRandomToken from "../utils/randomToken";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                const { providedIdentifier, password} = credentials as {
                    providedIdentifier: string,
                    password: string
                };

                try {
                    await dbConnect()
                    const user = await userModel.findOne({$or: [
                        { username: {
                            $regex: new RegExp(providedIdentifier, "i")
                        } },
                        { email: {
                            $regex: new RegExp(providedIdentifier, "i")
                        } }
                    ]})

                    if (!user) {
                        return null;
                    }
                    const isEqual = await verify(password, user.password);
                    if(!isEqual) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        Google({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        })
    ],
    session: {
        strategy: "jwt" as SessionStrategy
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
    callbacks: {
        async jwt({token, user, account }: {token: any, user: any, account: any}) {
            await dbConnect()
            const foundUser = await userModel.findOne({ email: token.email })
            if (account && user && foundUser) {
                token.user = {
                    id: foundUser._id.toString(),
                    email: foundUser.email,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    avatar: foundUser.avatar
                }
            }

            return token;
        },
        async session({session, token}: {session: any, token: any}) {
            session.user = token.user
            return session
        },
        async signIn({ user, profile }) {
            const googleProfile = profile as GoogleProfile;
            if (!googleProfile && !user) {
                return false;
            }

            if (googleProfile) {
                try {
                    await dbConnect()
                    const foundUser = await userModel.findOne({ email: googleProfile?.email })
    
                    if (!foundUser) {
                        await userModel.create({
                            username: generateRandomToken(12),
                            password: await hash(generateRandomToken(12)),
                            email: googleProfile.email,
                            firstName: googleProfile.given_name,
                            lastName: googleProfile.family_name,
                            joined: new Date(),
                            avatar: googleProfile.picture
                        })
                    }
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            }

            return true
        }
    }
}