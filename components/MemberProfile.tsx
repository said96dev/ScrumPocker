import React from 'react'
import ThemeToggle from './ThemeToggle';
import { UserButton, auth, currentUser } from '@clerk/nextjs';

const MemberProfile = async () => {

    return (
        <div className="navbar-end">
            <ThemeToggle />
            <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <UserButton afterSignOutUrl='/' />
                </div>
            </button>
        </div>
    )


}

export default MemberProfile