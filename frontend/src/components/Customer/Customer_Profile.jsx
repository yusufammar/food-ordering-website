import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

import '../../styles/app.css'
import '../../styles/myProfile.css'

import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import ForestIcon from '@mui/icons-material/Forest';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FlagIcon from '@mui/icons-material/Flag';
import SignpostIcon from '@mui/icons-material/Signpost';
import WbIridescentIcon from '@mui/icons-material/WbIridescent';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';


function CustomerProfile() {
    const navigate = useNavigate();
    const location = useLocation();

    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [profile, setProfile] = useState({});
    const [address, setAddress] = useState({});

    useEffect(getProfileRequest, []);
    // useEffect(updateProfile_Address, [profile,address]);

    // useEffect(displayAddress, [address]);

    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getProfileRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + `/user/getProfile`, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }

    function displayAddress(){
        console.log(address);
    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        // console.log(res.data);
        setProfile(res.data.profile);
        setAddress(res.data.profileAddress);
    }

    function updateProfile_Address() {
        console.log("Profile: ");
        console.log(profile);
        console.log("--------------");
        console.log("Address: ");
        console.log(address);
        console.log("--------------");
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <div className='pageDiv'>
            <NavBar role={roleRequired} />

            <div className='header'>
                <BadgeIcon sx={{ color: 'blue', fontSize: 40 }} />
                <a>My Profile</a>
            </div>


            <div className='profileDetails'>

                <div className="details">


                    <div className='detail'>
                        <PersonIcon /> {profile.name}
                    </div>

                    <div className='detail'>
                        <EmailIcon />   {profile.email}
                    </div>

                    <div className='detail'>
                        <PhoneInTalkIcon />    {profile.phone_no}
                    </div>


                </div>

            </div>



            <div className='header-small'>
                <HomeIcon sx={{ color: 'blue', fontSize: 30 }} />
                <a>Address Details</a>
            </div>

            <div className='profileDetails'>

                <div className="details">


                    <div className='detail'>
                        <ForestIcon /> <b>City:</b> {address.city}
                    </div>

                    <div className='detail'>
                        <FlagIcon /> <b>District:</b> {address.district}
                    </div>

                    <div className='detail'>
                        <SignpostIcon /> <b>Street:</b> {address.street}
                    </div>

                      <div className='detail'>
                        <ApartmentIcon /> <b>Building No:</b> {address.building_no}
                    </div>

                    <div className='detail'>
                        <HomeIcon /> <b>Apartment No:</b> {address.apt_no}
                    </div>

                    {
                        address.description &&
                         <div className='detail'>
                        <WbIridescentIcon/> <b>Description:</b> {address.description}
                    </div>
                    }
                   


                </div>

            </div>

        </div>

    );
}

export default CustomerProfile;