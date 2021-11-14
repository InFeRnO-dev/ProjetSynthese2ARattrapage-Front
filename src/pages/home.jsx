import React from 'react'
import { Redirect } from "react-router-dom";
import Nav from '../components/header/nav';
import { isAdmin, isAuthorized } from '../services/userService';

export default function Home(){

    return isAuthorized() ?(
    <>
        <Nav/>
        <div className="container">
          <h1 className="text-center mt-3">Tableau de bord</h1>
        </div>
    </>
    ) : (
      <>
        <Redirect to='/login'/>
      </>
    )
}
