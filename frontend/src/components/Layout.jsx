import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    
    return (
        <div className='flex flex-col'>
            <div className="">
                <Navbar />
            </div> 
        </div>
    )
}

export default Layout