import App from '../App';
import axios from 'axios';
import { useEffect } from 'react';

function Home(){

    function getHome(){
        axios.get(App.baseUrl+"/admin/")
            .then(res => console.log(res))
    }

    useEffect(getHome,[]);


    return(
    <h1>Home </h1>
    );
}

export default Home;