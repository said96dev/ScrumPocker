'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const SearchForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Use state to manage form inputs
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [createdByMe, setCreatedByMe] = useState(
    searchParams.get('createdByMe') === 'true'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams()
    params.set('search', search)
    params.set('createdByMe', createdByMe.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setSearch('')
    setCreatedByMe(false)
    router.push(`${pathname}?search=&createdByMe=false`)
  }

  return (
    <form
      className='bg-base-100 p-8 grid sm:grid-cols-1 md:grid-cols-[2fr,1fr] gap-12 rounded-lg'
      onSubmit={handleSubmit}
    >
      <label className='form-control w-full'>
        <div className='label flex flex-col md:grid md:grid-cols-[auto,1fr] gap-x-8 gap-y-5 '>
          <span className='label-text text-xl justify-end'>
            Game&apos;s name?
          </span>
          <div className='join'>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name='search'
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full max-w-xl join-item 
focus-visible:ring-0 focus:outline-none '
            />
            <button
              className='btn join-item rounded-r-full btn-secondary btn-md btn-outline'
              type='submit'
            >
              Search
            </button>
          </div>
        </div>
      </label>

      {/*       <div className='form-control w-full max-w-xl self-center'>
        <label className='cursor-pointer label'>
          <div className='flex gap-4 items-center'>
            <span className='label-text'>Show only the games I created</span>
            <input
              name='createdByMe'
              type='checkbox'
              checked={createdByMe}
              onChange={() => setCreatedByMe(!createdByMe)}
              className='checkbox checkbox-secondary'
            />
          </div>
        </label>
      </div> */}

      <div className='flex gap-2 self-center sm:justify-end justify-center'>
        <button
          type='button'
          className='btn btn-secondary btn-md btn-outline '
          onClick={handleClearSearch}
        >
          Clear Search
        </button>
      </div>
    </form>
  )
}

export default SearchForm
