import React, { useEffect, useState } from 'react'
import InputLabel from '../components/form/inputLabel'
import { getUserByEmail, JWTDecode, updateUser } from '../services/api/admin/userapi'
import { formHandleChange } from '../services/formService'
import styles from '../style/login.module.css'
import Moment from 'react-moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getInStore, TOKEN_KEY } from '../services/store'
import Nav from '../components/header/nav'
import { isAuthorized } from '../services/userService'
import { Redirect } from 'react-router'
import { logout } from '../services/tokenService'
toast.configure()

export default function UserInfo(props) {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    const [user, setuser] = useState({})
    const [email, setemail] = useState()
    async function getUser(){
        console.log(JWTDecode(getInStore(TOKEN_KEY)).login.email)
        let user = await getUserByEmail(JWTDecode(getInStore(TOKEN_KEY)).login.email)
        let date = new Date(user.date_de_naissance)
        user.date_de_naissance  = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
        console.log(user)
        setemail(user.email)
        setuser(user)
    }

    const handleChange =  (event) => {
        formHandleChange(event, user, setuser)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(user.numero_telephone.length !== 10) {
            console.log("erreur tel > 10")
            toast.warning("Le numéro de téléphone doit faire 10 caractères")
            return
        }
        if(regexnumerotelephone.exec(user.numero_telephone) === null) {
            toast.warning("Le numéro de téléphone doit être composé uniquement de chiffres au format français")
            return
        }
        if(user.code_postal.length !== 5) {
            toast.warning("Le code postal doit faire 5 caractères")
            return
        }
        if(regexcodepostal.exec(user.code_postal) === null) {
            toast.warning("Le code postal doit être composé uniquement de chiffres")
            return
        }
        if(user.ca_annuel_max < 0) {
            toast.warning("Le CA annuel ne doit pas être inférieur à 0")
            return
        }
        if(user.taux_charge < 0) {
            toast.warning("Le taux de charge ne doit pas être inférieur à 0")
            return
        }
        if(user.taux_charge > 100) {
            toast.warning("Le taux de charge ne doit pas être supérieur à 100")
            return
        }
        if(email !== user.email){
            const temp = await getUserByEmail(user.email)
            console.log(temp)
            if(temp !== ""){
                toast.warning("Cette adresse email est déjà utilisée")
                return
            }
        }
        if(user.pwd !== user.confpwd){
            toast.warning("Les mots de passe ne correspondent pas")
            return
        }
        console.log (user)
        await updateUser(user.email,
                            user.pwd,
                            user.nom,
                            user.prenom,
                            user.date_de_naissance,
                            user.numero_telephone,
                            user.adresse_1,
                            user.adresse_2,
                            user.code_postal,
                            user.ville,
                            user.ca_annuel_max,
                            user.taux_charge,
                            user.administrator,
                            email)
        console.log('submit !')
        toast.success("Modification effectuée. Veuillez vous reconnecter")
        logout()
        props.history.push("/login")
    }

    useEffect(() => {
        getUser()
    }, [])

    return isAuthorized() ?(
        <>
        <Nav/>
        <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1 className="mt-3" style={{textAlign: 'center'}}>Information du compte</h1>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="email" className="form-control my-3 p-2" value={user.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="pwd" className="form-control my-3 p-2" value={user.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                            </div>
                        <div className="col-6">
                            <InputLabel name="confpwd" className="form-control my-3 p-2" value={user.confpwd} change={handleChange} type="password" label="Confirmation du mot de passe" placeholder="********" required="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="nom" className="form-control my-3 p-2" value={user.nom} change={handleChange} type="text" label="Nom" placeholder="DUPONT" required="true"/>
                        </div>
                        <div className="col-6">
                            <InputLabel name="prenom" className="form-control my-3 p-2" value={user.prenom} change={handleChange} type="text" label="Prenom" placeholder="Pierre" required="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="date_de_naissance" className="form-control my-3 p-2" value={user.date_de_naissance} change={handleChange} type="date" label="Date de naissance" placeholder="01/01/1901" required="true"/>
                        </div>
                        <div className="col-6">
                            <InputLabel name="numero_telephone" className="form-control my-3 p-2" value={user.numero_telephone} change={handleChange} type="number" label="Numéro de téléphone" placeholder="0601020304" required="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="adresse_1" className="form-control my-3 p-2" value={user.adresse_1} change={handleChange} type="text" label="Adresse postale" placeholder="12 rue du paradis" required="true"/>
                        </div>
                        <div className="col-6">
                            <InputLabel name="adresse_2" className="form-control my-3 p-2" value={user.adresse_2} change={handleChange} type="text" label="Complément d'adresse" placeholder="Batiment B"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="code_postal" className="form-control my-3 p-2" value={user.code_postal} change={handleChange} type="number" label="Code postal" placeholder="13000" required="true" pattern="[0-9]"/>
                        </div>
                        <div className="col-6">
                            <InputLabel name="ville" className="form-control my-3 p-2" value={user.ville} change={handleChange} type="text" label="Ville" placeholder="Marseille" required="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <InputLabel name="ca_annuel_max" className="form-control my-3 p-2" value={user.ca_annuel_max} change={handleChange} type="number" label="CA annuel max" placeholder="100000" required="true"/>
                        </div>
                        <div className="col-6">
                            <InputLabel name="taux_charge" className="form-control my-3 p-2" value={user.taux_charge} change={handleChange} type="number" label="Taux de charge" placeholder="20" required="true"/>
                        </div>
                    </div> 
                    <div className="form-row">
                        <div className="col-12">
                            <button type="submit" className="btn btn-primary mt-1 w-100">Modifier</button>
                        </div>
                    </div>
                </form>   
            </div>
        </>
    ) : (
        <Redirect to='/login'/>
    )
}
