import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'

type NavLinks = {
  href: string
  label: string
}

export const Links: NavLinks[] = [
  {
    href: '/new_game',
    label: 'New Game',
  },
  {
    href: '/my_games',
    label: 'My Games',
  },
]
