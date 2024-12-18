import Image from 'next/image'
import LandingImg from '../assets/main.svg'
import { SiOpenaigym } from 'react-icons/si'
import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <header className='max-w-6xl mx-auto px-4 sm:px-8 py-6'>
        <div className='flex items-center mb-4 gap-4 '>
          <SiOpenaigym className='w-10 h-10 text-primary' />
          <h2 className='text-xl font-extrabold text-primary mr-auto'>
            {' '}
            Scrum Poker
          </h2>
        </div>{' '}
      </header>
      <section className='max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center'>
        <div>
          <h1 className='capitalize text-4xl md:text-7xl font-bold'>
            <span className='text-primary'>Scrum</span> Poker
          </h1>
          <p className='leading-loose max-w-md mt-4'>
            With a user-friendly interface, the platform enables intuitive
            estimation of story points and improves estimation accuracy.{' '}
          </p>
          <Link href='/new_game' className='btn btn-primary mt-3'>
            Start New Game
          </Link>
        </div>
        <Image src={LandingImg} alt='landing' className='hidden lg:block' />
      </section>
    </main>
  )
}
