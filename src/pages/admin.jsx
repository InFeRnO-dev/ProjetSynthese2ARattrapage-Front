import React, { useEffect, useState } from 'react'
import Nav from '../components/header/nav'
import { getAllUser, getUserByEmail, insertUser } from '../services/api/admin/userapi'
import UserLine from '../components/admin/userLine'
import InputLabel from '../components/form/inputLabel'
import { formHandleChange } from '../services/formService'
import { isAdmin, isAuthorized } from '../services/userService'
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
toast.configure()

export default function Admin() {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    const [credentials, setCredentials] = useState({email: '', 
                                                    pwd: '',
                                                    nom: '',
                                                    prenom: '',
                                                    date_de_naissance: '',
                                                    numero_telephone: '',
                                                    adresse_1: '',
                                                    adresse_2: '',
                                                    code_postal: 0,
                                                    ville: '',
                                                    ca_annuel_max: 0,
                                                    taux_charge: 0,
                                                    administrator: false
                                                    })
    const [users, setusers] = useState([])
    
    async function getAllUsers(){
        setusers(await getAllUser())
    }

    const handleChange =  (event) => {
        formHandleChange(event, credentials, setCredentials)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = await getUserByEmail(credentials.email)
        if(credentials.numero_telephone.length !== 10) {
            console.log("erreur tel > 10")
            toast.warning("Le numéro de téléphone doit faire 10 caractères")
            return
        }
        if(regexnumerotelephone.exec(credentials.numero_telephone) === null) {
            toast.warning("Le numéro de téléphone doit être composé uniquement de chiffres au format français")
            return
        }
        if(credentials.code_postal.length !== 5) {
            toast.warning("Le code postal doit faire 5 caractères")
            return
        }
        if(regexcodepostal.exec(credentials.code_postal) === null) {
            toast.warning("Le code postal doit être composé uniquement de chiffres")
            return
        }
        if(credentials.ca_annuel_max < 0) {
            toast.warning("Le CA annuel ne doit pas être inférieur à 0")
            return
        }
        if(credentials.taux_charge < 0) {
            toast.warning("Le taux de charge ne doit pas être inférieur à 0")
            return
        }
        if(credentials.taux_charge > 100) {
            toast.warning("Le taux de charge ne doit pas être supérieur à 100")
            return
        }
        if(email !== ""){
            toast.warning("Cette adresse email est déjà utilisée")
            return
        }
        if(credentials.pwd !== credentials.confpwd){
            toast.warning("Les mots de passe ne correspondent pas")
            return
        }
        console.log (credentials)
        await insertUser(credentials.email,
                         credentials.pwd,
                         credentials.nom,
                         credentials.prenom,
                         credentials.date_de_naissance,
                         credentials.numero_telephone,
                         credentials.adresse_1,
                         credentials.adresse_2,
                         credentials.code_postal,
                         credentials.ville,
                         credentials.ca_annuel_max,
                         credentials.taux_charge,
                         credentials.administrator)
        console.log('submit !')
        toast.success("Ajout effectué")
        getAllUsers()
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
                    <div className="col-3">
                        <p>Nom / Prenom</p>
                    </div>
                    <div className="col-2">
                        <p>Administrateur</p>
                    </div>
                    <div className="col-3">
                        <p>Options</p>
                    </div>
                </div>
                    {users.map((linkData, index) => {return <UserLine key={index} index={linkData.id_user} user={linkData}/>})}
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">Ajouter un utilisateur</button>
            </div>

            <div className="modal" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addUserModalLabel">Ajouter un Utilisateur</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel id="email" name="email" className="form-control my-3 p-2" value={credentials.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel id="pwd" name="pwd" className="form-control my-3 p-2" value={credentials.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                                     </div>
                                    <div className="col-6">
                                        <InputLabel id="confpwd" name="confpwd" className="form-control my-3 p-2" value={credentials.confpwd} change={handleChange} type="password" label="Confirmation du mot de passe" placeholder="********" required="true"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel name="nom" className="form-control my-3 p-2" value={credentials.nom} change={handleChange} type="text" label="Nom" placeholder="DUPONT" required="true"/>
                                    </div>
                                    <div className="col-6">
                                        <InputLabel name="prenom" className="form-control my-3 p-2" value={credentials.prenom} change={handleChange} type="text" label="Prenom" placeholder="Pierre" required="true"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel name="date_de_naissance" className="form-control my-3 p-2" value={credentials.date_de_naissance} change={handleChange} type="date" label="Date de naissance" placeholder="01/01/1901" required="true"/>
                                    </div>
                                    <div className="col-6">
                                        <InputLabel name="numero_telephone" className="form-control my-3 p-2" value={credentials.numero_telephone} change={handleChange} type="number" label="Numéro de téléphone" placeholder="0601020304" required="true"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel name="adresse_1" className="form-control my-3 p-2" value={credentials.adresse_1} change={handleChange} type="text" label="Adresse postale" placeholder="12 rue du paradis" required="true"/>
                                    </div>
                                    <div className="col-6">
                                        <InputLabel name="adresse_2" className="form-control my-3 p-2" value={credentials.adresse_2} change={handleChange} type="text" label="Complément d'adresse" placeholder="Batiment B"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel name="code_postal" className="form-control my-3 p-2" value={credentials.code_postal} change={handleChange} type="number" label="Code postal" placeholder="13000" required="true" pattern="[0-9]"/>
                                    </div>
                                    <div className="col-6">
                                        <InputLabel name="ville" className="form-control my-3 p-2" value={credentials.ville} change={handleChange} type="text" label="Ville" placeholder="Marseille" required="true"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <InputLabel name="ca_annuel_max" className="form-control my-3 p-2" value={credentials.ca_annuel_max} change={handleChange} type="number" label="CA annuel max" placeholder="100000" required="true"/>
                                    </div>
                                    <div className="col-6">
                                        <InputLabel name="taux_charge" className="form-control my-3 p-2" value={credentials.taux_charge} change={handleChange} type="number" label="Taux de charge" placeholder="20" required="true"/>
                                    </div>
                                </div>
                                <p>Administrateur</p>
                                <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" className="btn-check" name="administrator" value={true} onChange={handleChange} id="btnadminoui" autoComplete="off" />
                                    <label className="btn btn-outline-primary" htmlFor="btnadminoui">Oui</label>

                                    <input type="radio" className="btn-check" name="administrator" value={false} onChange={handleChange} id="btnadminnon" autoComplete="off" defaultChecked />
                                    <label className="btn btn-outline-primary" htmlFor="btnadminnon">Non</label>
                                </div>
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