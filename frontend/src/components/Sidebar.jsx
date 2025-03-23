import React from "react";
import { Link } from "react-router-dom";
import '../styles/Sidebar.css';
const Sidebar = () => {
    return (
        <div className="sidebar col-2">
            <div className="profile">
                <h3>ADMIN</h3>
                <div className="avatar_area d-flex justify-content-center">
                    <div className="profile_img_wrap">
                        <img src="/avatar.jpg" alt="Profile" />
                    </div>
                    <h4>Xin chào <br />Anh Thy</h4>
                </div>
            </div>
            <ul className="menu">
                <li className="tab_link dashboard">
                    <div className="tab_group">
                        <i class="fa-solid fa-gauge"></i>
                        <Link to="/dashboard">Dashboard</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link product">
                    <div className="tab_group">
                        <i class="fa-solid fa-box"></i>
                        <Link to="/product">Product</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link order">
                    <div className="tab_group">
                        <i class="fa-solid fa-box"></i>
                        <Link to="/order">Order</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link discount">
                    <div className="tab_group">
                        <i class="fa-solid fa-box"></i>
                        <Link to="/discount">Discount</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link member">
                    <div className="tab_group">
                        <i class="fa-solid fa-user"></i>
                        <Link to="/member">Member</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link member">
                    <div className="tab_group">
                        <i class="fa-solid fa-file-import"></i>
                        <Link to="/product">Import</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </li>
                <li className="tab_link member">
                    <div className="tab_group">
                        <i class="fa-solid fa-file-export"></i>
                        <Link to="/product">Export</Link>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>    
                </li>
            </ul>
        </div>
    );
}
export default Sidebar;