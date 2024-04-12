"use client"

import React from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SearchForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter()
    const pathname = usePathname()
    const search = searchParams.get('search') || '';
    const createdByMe = searchParams.get('createdByMe') === 'true';
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const search = formData.get("search") as string
        const createdByMe = formData.get("createdByMe") as string
        let params = new URLSearchParams()
        params.set('search', search)
        params.set('createdByMe', createdByMe)
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <form
            className="bg-base-100 mb-16 p-8 grid sm:grid-cols-3 md:grid-cols-[1fr,400px,200px]  gap-12 rounded-lg"
            onSubmit={handleSubmit}
        >
            <label className="form-control w-full ">
                <div className="label flex flex-1">
                    <span className="label-text text-xl justify-end">Game&apos;s name?</span>
                    <input defaultValue={search} name="search" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xl" />

                </div>
            </label>
            <div className="form-control w-full max-w-xl self-center">
                <label className="cursor-pointer label">
                    <div className="flex gap-4 items-center">
                        <span className="label-text">show only the games I created</span>
                        {/* Replace with custom checkbox styling if desired */}
                        <input
                            name="createdByMe"
                            type="checkbox"
                            className="checkbox checkbox-secondary" // Or custom styles
                            onChange={() => console.log("check")}
                        />
                    </div>
                </label>
            </div>
            <button type="submit" className=" self-center btn btn-secondary">
                search
            </button>
        </form>
    )
}

export default SearchForm