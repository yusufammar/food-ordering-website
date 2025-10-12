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


function AdminUploadProductsImages() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [files, setFiles] = useState();

    function handleFilesChange(event) {
        setFiles(event.target.files);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    async function handleUpload() {
        //Input Validation
        if (files.length == 0 || files == null) {
            alert("Please Select Images to Upload")
            return;
        }

        //------------------------------------

        const formData = new FormData();
        for (let file of files)
            formData.append('images', file);

        const config = {
            headers:
            {
                authorization: user.token,
                'Content-Type': 'multipart/form-data'
            }
        };

        return axios.post(App.baseUrl + "/admin/uploadProductsImages", formData, config)
            .then(res => utilsErrorHandling.handleSuccessStandard(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));


        // console.log(res.data.files); // array of uploaded file URLs

    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    return (
        <>
            <NavBar role={roleRequired} />

            <h1>Admin - Upload Products Images</h1>

            <br /> <br />

            <h2>Upload Instructions</h2>
            <a>- <b>Image Filename</b>: must match product name exactly, including spaces & uppercase letters</a> <br/><br/>
            <a>- <b>Allowed Image Extensions</b>: .jpg, .jpeg, .png </a> <br />
            <a>- <b>Max Size Per Image</b>: 200 kb</a> <br />
            <a>- <b>Max No of Images</b>: 150 </a> <br /><br />

            <a>Note: previous files are cleared with every upload, even with failed ones</a> <br /> <br /> <br /> <br />


            <div>
                <input type='file' multiple accept=".jpg,.jpeg,.png" onChange={handleFilesChange} />
                <button type="submit" onClick={handleUpload}>Upload</button>
            </div>


        </>

    );
}

export default AdminUploadProductsImages;