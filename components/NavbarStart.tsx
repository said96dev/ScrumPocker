'use client'
import React from 'react'
import { SiOpenaigym } from 'react-icons/si'
import Link from 'next/link'
import { Users, PlaySquare, MessagesSquare } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const NavbarStart = () => {
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
    <div className='navbar-start'>
      <div className='dropdown'>
        <button tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h8m-8 6h16'
            />
          </svg>
        </button>
        <ul
          tabIndex={0}
          className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
        >
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
      <div className='flex items-center gap-4 w-full flex-1'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 24 24'
          className='w-10 h-10 text-secondary'
        ></svg>
        <Link
          href='/'
          className='text-xl font-extrabold text-secondary mr-auto text-nowrap'
        >
          Scrum Poker
        </Link>
      </div>
    </div>
  )
}

export default NavbarStart
