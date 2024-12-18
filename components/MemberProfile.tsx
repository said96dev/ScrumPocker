'use client'
import React from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth, UserButton } from '@clerk/nextjs'

const MemberProfile = () => {
  const { isSignedIn } = useAuth()

  return (
    <div className='navbar-end'>
      <ThemeToggle />
      {isSignedIn && (
        <button className='btn btn-ghost btn-circle'>
          <div className='indicator'>
            <UserButton afterSignOutUrl='/' />
          </div>
        </button>
      )}
    </div>
  )
}

export default MemberProfile
