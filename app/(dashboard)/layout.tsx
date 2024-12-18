import Navbar from '@/components/Navbar'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-base-200 min-h-[100vh] flex flex-col'>
      <Navbar />
      <div className='flex-1 overflow-auto'>
        <div className='bg-base-200 px-8'>{children}</div>
      </div>
    </div>
  )
}

export default layout
