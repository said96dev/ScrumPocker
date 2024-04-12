import { UserProfile, auth } from '@clerk/nextjs';

const ProfilePage = async () => {
    const { userId } = auth();
    return (
        <div className='flex justify-center items-center '>
            <UserProfile />
        </div>
    );
};
export default ProfilePage;