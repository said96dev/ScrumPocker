import Navbar from '@/components/Navbar';
import { FaBarsStaggered } from 'react-icons/fa6';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex flex-col gap-10 bg-base-200'>
            <Navbar />
            <div className="flex flex-col justify-center min-h-screen">
                <div className="bg-base-200 px-8 min-h-screen mt-8" >
                    {children}
                </div>
            </div>
        </div>


    );
};
export default layout;