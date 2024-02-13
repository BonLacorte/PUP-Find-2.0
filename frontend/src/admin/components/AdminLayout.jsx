import { Outlet, useLocation } from 'react-router-dom';
import AdminDashSidebar from './AdminDashSidebar';

const AdminLayout = () => {

    return (
        <div className=''>
            <div className="">
                <AdminDashSidebar />
            </div> 
        </div>
    )
}

export default AdminLayout