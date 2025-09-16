import App from '../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';
import * as utilsInputValidation from '../utils_inputValidation';


function AdminImportProducts() {
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

    async function handleRequest(e) {
        e.preventDefault();

        const data = [
            { key: "productsArray", value: file, type: "excelFile", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------
        const config = { headers: { authorization: user.token } };

        return axios.post(App.baseUrl + "/admin/importProducts", transformedData, config)
            .then(res => utilsErrorHandling.handleSuccessStandard(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Admin - Import Products</h1>

            <div>
                <input type='file' onChange={handleFileChange} />
                <button type="submit" onClick={handleRequest}>Import</button>
            </div>


        </>

    );
}

export default AdminImportProducts;