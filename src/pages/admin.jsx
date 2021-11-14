import React, { useEffect, useState } from 'react'
import Nav from '../components/header/nav'
import { getAllUser, insertUser } from '../services/api/admin/userapi'
import UserLine from '../components/admin/userLine'
import InputLabel from '../components/form/inputLabel'
import { formHandleChange } from '../services/formService'
import { isAdmin, isAuthorized } from '../services/userService'
import { Redirect } from "react-router-dom";

export default function Admin() {
    const [error, seterror] = useState(false)
    const [credentials, setCredentials] = useState({email: '', pwd: '', confpwd:''})
    const [users, setusers] = useState([])
    
    async function getAllUsers(){
        setusers(await getAllUser())
    }

    const handleChange =  (event) => {
        formHandleChange(event, credentials, setCredentials)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        seterror(false)
        if(credentials.email !== "" && credentials.pwd !== "" && credentials.confpwd !== "")
        {
            if(credentials.pwd === credentials.confpwd)
            {
                console.log (credentials)
                await insertUser(credentials.email, credentials.pwd)
                console.log('submit !')
                getAllUsers()
            } else {
                seterror(true)
            }
        }else {
            seterror(true)
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return isAuthorized() && isAdmin() ?(
        <>
            <Nav/>
            <div className="container mt-3">
                <h1 className="text-center">Gestion des utilisateurs</h1>
                <div className="row mt-5 border-bottom">
                    <div className="col-3">
                        <p>Email</p>
                    </div>
                    <div className="col-4">
                        <p>Administrateur</p>
                    </div>
                    <div className="col-2">
                        <p>Options</p>
                    </div>
                </div>
                    {users.map((linkData, index) => {return <UserLine key={index} index={linkData.id_user} user={linkData}/>})}
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">Ajouter un utilisateur</button>
            </div>

            <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addUserModalLabel">Ajouter un Utilisateur</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {
                                    error && (
                                    <div className="alert alert-dismissible alert-danger">
                                        <strong>Erreur </strong>Le mot de passe ne correspond pas
                                        <button type="button" className="btn-close" aria-label="Close" data-bs-dismiss="alert"></button>
                                    </div>
                                    )
                                }
                                
                                <InputLabel name="email" className="form-control my-3 p-2" value={credentials.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
                                <InputLabel name="pwd" className="form-control my-3 p-2" value={credentials.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                                <InputLabel name="confpwd" className="form-control my-3 p-2" value={credentials.confpwd} change={handleChange} type="password" label="Confirmation du mot de passe" placeholder="********" required="true"/>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <Redirect to='/login'/>
    )
}