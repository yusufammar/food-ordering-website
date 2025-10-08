import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';
import '../styles/navbar.css' // overwrites, main css, bc bundled after it
import UserBar from './UserBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';

function NavBar({ role, cart }) {
    const user = utils.getSavedUser();
    const navigate = useNavigate();

    const settings = utils.getSettings();
    // console.log(settings);

    //------------------------------------------------------

    function openNav() {
        document.getElementById("sidebar").classList.add("active");
        document.getElementById("overlay").classList.add("active");
    }

    function closeNav() {
        document.getElementById("sidebar").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
    }


    function navigateHome() {
        navigate("/");
    }

    function logout2() {
        if (cart)
            utils.setCart(cart)

        utils.unsetUser();
        navigate("/login");
        //  window.location.reload();
    }


    return (
        <>
            <nav className='navbar'>
                <div className="layoutBox1">
                    <StorefrontIcon className='storeIcon' sx={{ fontSize: 40, color: 'blue', padding: "5px" }} onClick={navigateHome} />
                </div>



                <div className="titleDiv" onClick={navigateHome}>
                    {/* Restaurant Name */}
                    {/* {!settings.storeName && settings.storeName} */}
                    {settings.storeName}


                    {/* <h1 className='title'>Restaurant Name */}
                    {/* dsvondfn fvsdinvofdn fdvknfvnffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff fffffffffffddddddddddddddddddddddddddd */}
                    {/* </h1> */}

                </div>

                <div className="layoutBox2">
                    <AccountCircleIcon className='profileIcon' sx={{ fontSize: 40, color: 'blue', padding: "5px" }} onClick={openNav} />
                </div>

            </nav>


            <div id="sidebar" className='sidebar'>

                {(user.role != null) ? // Show Only For Any Logged In User (Any Role), Else Sign Up Link
                    <>

                        <div className='logoutDiv'>

                            <LogoutIcon className='logoutIcon' sx={{ fontSize: 40, color: 'red', padding: "5px" }} onClick={logout2} />
                            <AccountCircleIcon className='profileIcon' sx={{ fontSize: 40, color: 'blue', padding: "5px" }} onClick={closeNav} />

                        </div>
                        <br></br>
                        <UserBar role={role} />

                    </>
                    : // No User Logged In- Options
                    <>
                        <div className='spacer1' />
                        <div className='links'>
                            <div className='linkDiv' onClick={() => navigate("/signUp")}>
                                <AssignmentIcon sx={{ color: 'blue' }} /> <a>Sign Up</a>
                            </div>
                            <div className='linkDiv' onClick={() => navigate("/login")}>
                                <LoginIcon sx={{ color: 'blue' }} /> <a>Log In</a>
                            </div>
                        </div>
                    </>

                }


                <br></br>


                {(user.role == "customer") && // Links for User (Customer)
                    <>
                        <br></br><br></br>
                        <div className='links'>
                            <div className='linkDiv' onClick={() => navigate("/customerOrderHistory")}>
                                <HistoryIcon sx={{ color: 'blue' }} /> <a>Order History</a>
                            </div>

                            <div className='linkDiv' onClick={() => navigate("/customerProfile")}>
                                <BadgeIcon sx={{ color: 'blue' }} /> <a>My Profile</a>
                            </div>
                        </div>
                    </>

                }

            </div>

            <div id="overlay" className="overlay" onClick={closeNav} />

        </>
    );
}

export default NavBar;