import MemberProfile from './MemberProfile'
import NavLinks from './NavLinks'
import NavbarStart from './NavbarStart'

const Sidebar = () => {
  return (
    <div className='navbar bg-base-100 min-h-[8vh] py-0'>
      <NavbarStart />
      <NavLinks />
      <MemberProfile />
    </div>
  )
}
export default Sidebar
