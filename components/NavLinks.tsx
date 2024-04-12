"use client"
import React from 'react'
import Link from "next/link"
import { Links } from "@/utils/links"
import { usePathname } from 'next/navigation';

const NavLinks = () => {
    const pathname = usePathname();

    return (
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
                {
                    Links.map((link, index) => {
                        return (
                            <li key={index} className={`outline-none ${link.href === pathname ? " border-b-4 border-secondary" : ""}`}>
                                <Link href={link.href}>
                                    {link.label}
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default NavLinks