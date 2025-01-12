export { default } from "next-auth/middleware"

export const config = {
    matcher: ['/dashboard', '/account', '/audit', '/!account/forgot-password']
}