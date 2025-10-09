import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';


function AdminUploadStoreLogo() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [file, setFile] = useState();

    function handleFileChange(event) {
        setFile(event.target.files[0]);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

  
    async function handleUpload() {
        //Input Validation
        if (!file) {
            alert("Please Select Images to Upload")
            return;
        }

        //------------------------------------

        const formData = new FormData();
        formData.append('image', file);

        const config = {
            headers:
            {
                authorization: user.token,
                'Content-Type': 'multipart/form-data'
            }
        };

        return axios.post(App.baseUrl + "/admin/uploadStoreLogo", formData, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));


        // console.log(res.data.files); // array of uploaded file URLs

    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSuccess(res){
        utilsErrorHandling.handleSuccessStandard(res);
        window.location.reload();
    }

    return (
        <>
            <NavBar role={roleRequired} />

            <h1>Admin - Upload Store Logo</h1>

            <br /> <br />

            <h2>Upload Instructions</h2>

            <a>- <b>Allowed Image Extensions</b>: .jpg, .jpeg, .png, .ico </a> <br />
            <a>- <b>Max Size Per Image</b>: 200 kb</a> <br />
            <a>- <b>Max No of Images</b>: 1 </a> <br />

            <a>Note: previous files are cleared with every upload, even with failed ones</a> <br /> <br /> <br /> <br />


            <div>
                <input type='file'  accept=".jpg, .jpeg, .png, .ico" onChange={handleFileChange} />
                <button type="submit" onClick={handleUpload}>Upload</button>
            </div>


        </>

    );
}

export default AdminUploadStoreLogo;