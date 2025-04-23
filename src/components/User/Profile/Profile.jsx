import React, { useEffect } from 'react';
import { ACTIVE_VALUE_NAVBAR } from '../../../lib/app-const';
import { useNavabar } from '../../../providers/users/NavBarProvider';

const Profile = () => {
  const { setActive } = useNavabar();
  useEffect(() => {
    setActive(ACTIVE_VALUE_NAVBAR.INFOMATION);
  }, []);
  return (
    <div className="flex min-h-screen container mb-8">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center mb-6 gap-3">
          <img
            src="https://down-vn.img.susercontent.com/file/vn-11134226-23010-51eglpoj2fmvad_tn"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">linhtrngngv</p>
            <p className="text-xs text-gray-500">Sửa Hồ Sơ</p>
          </div>
        </div>
        <nav className="space-y-4 text-sm text-gray-700">
          <div className="text-orange-500 font-semibold">Tài Khoản Của Tôi</div>
          <ul className="pl-2 space-y-2 text-sm">
            <li className="text-orange-500">Hồ Sơ</li>
            <li>Địa Chỉ</li>
            <li>Đổi Mật Khẩu</li>
          </ul>
          <div className="pt-4 space-y-2">
            <div>Đơn Mua</div>
            <div>Kho Voucher</div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10  bg-white">
        <h1 className="text-lg font-semibold mb-2">Hồ Sơ Của Tôi</h1>
        <p className="text-sm text-gray-500 mb-6">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>

        <div className="flex">
          {/* Form */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <label className="w-40 text-gray-600">Tên đăng nhập</label>
              <span>linhtrngngv</span>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-gray-600">Email</label>
              <span>tr********@gmail.com</span>
              <a href="#" className="text-blue-500 ml-2">Thay Đổi</a>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-gray-600">Số điện thoại</label>
              <a href="#" className="text-blue-500">Thêm</a>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-gray-600">Giới tính</label>
              <div className="space-x-4">
                <label><input type="radio" name="gender" /> Nam</label>
                <label><input type="radio" name="gender" /> Nữ</label>
                <label><input type="radio" name="gender" /> Khác</label>
              </div>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-gray-600">Ngày sinh</label>
              <input type="date" className="border px-3 py-1 rounded" />
            </div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
              Lưu
            </button>
          </div>

          {/* Avatar */}
          <div className="w-64 text-center ml-10">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="w-24 h-24 mx-auto rounded-full mb-3"
              alt="avatar"
            />
            <button className="text-blue-500">Chọn Ảnh</button>
            <p className="text-xs text-gray-500 mt-2">
              Dung lượng file tối đa 1 MB <br />
              Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
