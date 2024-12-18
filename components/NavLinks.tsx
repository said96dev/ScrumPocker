'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Users, PlaySquare, MessagesSquare } from 'lucide-react'

const NavLinks = () => {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  // Define Links inside the component so isSignedIn is available
  const links: {
    href: string
    label: string
    access: boolean
    icon: React.ReactNode
  }[] = [
    {
      href: '/new_game',
      label: isSignedIn ? 'New Game' : 'Kick Off Your First Game',
      access: true, // "New Game" is accessible to everyone
      icon: <PlaySquare />,
    },
    {
      href: '/my_games',
      label: 'My Games',
      access: isSignedIn as boolean, // "My Games" is only accessible when signed in
      icon: <Users />,
    },
    {
      href: '/contact',
      label: 'Contact',
      access: true, // "New Game" is accessible to everyone
      icon: <MessagesSquare />,
    },
  ]

  return (
    <div className='navbar-center hidden lg:flex'>
      <ul className='menu menu-horizontal gap-5'>
        {links.map((link, index) => {
          // Check if the link should be visible based on the access property
          if (link.access) {
            return (
              <li
                key={index}
                className={`outline-none ${
                  link.href === pathname ? 'border-b-4 border-secondary' : ''
                }`}
              >
                <Link href={link.href}>
                  {' '}
                  {link.icon} {/* Render the icon */}
                  {link.label}
                </Link>
              </li>
            )
          }
          return null // If access is false, don't render the link
        })}
      </ul>
    </div>
  )
}

export default NavLinks
