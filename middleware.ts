import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/room',
    '/room/join/:id',
    '/room/join/(.*)',
    '/room/:id',
    '/room/(.*)',
    '/api/socket',
    '/contact',
  ],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
