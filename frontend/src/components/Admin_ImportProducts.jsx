import App from '../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as utils from '../utils';
import * as XLSX from 'xlsx';
import NavBar from './NavBar';
import UserBar from './UserBar';


function AdminImportProducts() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [file, setFile] = useState();


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    function handleChange(event) {
        setFile(event.target.files[0]);
    }


    function handleImport() {
        let [fileValid, errMessage] = validateFile();

        if (fileValid)
            readExcelFile();
        else
            alert(errMessage);

    }

    async function readExcelFile() {

        //Step 0: read binary
        const data = await file.arrayBuffer();

        // Step 1: Parse Excel binary into workbook object
        const workbook = XLSX.read(data, { type: 'array' });

        // Step 2: Access first sheet (Sheet 1)
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Step 3: Convert sheet 1 data to JSON
        const sheet_json = XLSX.utils.sheet_to_json(sheet);
        console.log(sheet_json); // Parsed rows from Excel Sheet 1

        return importProducts(sheet_json);
    }

    function importProducts(productsArray) {
        const config = {
            headers: {
                authorization: user.token
            }
        }
        const data = { productsArray };

        return axios.post(App.baseUrl + "/admin/importProducts", data, config)
            .then(res => handleSuccess(res))
            .catch(err => handleFailure(err));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSuccess(res) {
        const { message } = res.data;
        alert(message);
    }


    function handleFailure(err) {
        const error = err.response.data.error;
        alert(error);

        if (err.status != 400) { //all other status codes means unauthorized or forbidden: so admin should be logged out
            logout()
        }
    }

    //------------------------------------------------------

    function logout() {

        utils.unsetUser();
        window.location.reload();

    }

    function validateFile() {
        let fileValid = false;
        let errMessage = "";

        if (file) {
            let fileType = file.name.split(".")[1];
            if (fileType == "xlsx" || fileType == "csv") {
                fileValid = true;
            }
            else {
                fileValid = false;
                errMessage = "Wrong File Type: Please Upload an excel file (.xlsx or .csv)";
            }
        }
        else {
            fileValid = false;
            errMessage = "No file selected";

        }

        return [fileValid, errMessage];
    }



    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Admin - Import Products</h1>

            <div>
                <input type='file' onChange={handleChange} />
                <button type="submit" onClick={handleImport}>Import</button>
            </div>


        </>

    );
}

export default AdminImportProducts;