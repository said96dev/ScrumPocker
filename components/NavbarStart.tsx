import React from 'react'
import { SiOpenaigym } from 'react-icons/si';
import Link from "next/link";
const NavbarStart = () => {
    return (
        <div className="navbar-start">
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Item 1</a></li>
                    <li>
                        <a>Parent</a>
                        <ul className="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                    </li>
                    <li><a>Item 3</a></li>
                </ul>
            </div>
            <div className='flex items-center gap-4'>
                <SiOpenaigym className='w-10 h-10 text-secondary' />
                <Link href="/" className='text-xl font-extrabold text-secondary mr-auto'>PublicPlan Scrum Poker</Link>
            </div>
        </div>
    )
}

export default NavbarStart