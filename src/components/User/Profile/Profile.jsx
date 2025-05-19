import React, { useEffect, useState } from 'react';
import { ACTIVE_VALUE_NAVBAR } from '../../../lib/app-const';
import { useNavbar } from '../../../providers/users/NavBarProvider';
import { Link, Outlet } from 'react-router-dom';
import { getInfo } from '../../../services/auth-service/auth-service';
import { PROFILE_MENU, useProfileMenu } from '../../../providers/users/ProfileMenuProvider';


const Profile = () => {
  const { setActive } = useNavbar();
  const [userInfo, setUserInfo] = useState();
  const { option } = useProfileMenu();

  const getUserInfo = async () => {
    const info = await getInfo();
    setUserInfo(info);
  }

  useEffect(() => {
    setActive(ACTIVE_VALUE_NAVBAR.INFOMATION);
    getUserInfo();
  }, []);

  return (
    <>
      {userInfo &&
        <div className="flex min-h-screen container mb-8">
          {/* Sidebar */}
          <aside className="w-64 border-r border-gray-200 p-4">
            <div className="flex items-center mb-6 gap-3">
              <img
                src={userInfo.avatar ? userInfo.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-sm">{userInfo.username}</p>
              </div>
            </div>
            <nav className="space-y-4 text-sm text-gray-700">
              <div className={`text-500 font-semibold ${option == PROFILE_MENU.ADDRESS || option == PROFILE_MENU.INFO ? 'text-[#fecb02]' : ''}`}>Your Account</div>
              <ul className="pl-2 space-y-2 text-sm">
                <Link to={"/info"}><li className={`${option == PROFILE_MENU.INFO ? 'text-[#fecb02]' : ''}`}>Information</li></Link>
                <Link to={"/info/address"}><li className={`${option == PROFILE_MENU.ADDRESS ? 'text-[#fecb02]' : ''}`}>Address</li></Link>
                <li>Change Password</li>
              </ul>
              <div className="pt-4 space-y-2">
                <div>Orders History</div>
              </div>
            </nav>
          </aside>

          <Outlet />
        </div>
      }

    </>

  );
};

export default Profile;
