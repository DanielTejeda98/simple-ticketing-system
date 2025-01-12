export { default } from "next-auth/middleware"

export const config = {
    matcher: ['/((?!$|api|account/forgot-password|account/create|initialization|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}