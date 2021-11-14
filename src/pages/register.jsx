import React, { useState } from 'react'
import InputLabel from '../components/form/inputLabel'
import { getUserByEmail, insertUser } from '../services/api/admin/userapi'
import { formHandleChange } from '../services/formService'
import styles from '../style/login.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

export default function Register(props) {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    const [credentials, setCredentials] = useState({email: '', 
                                                    pwd: '',
                                                    nom: '',
                                                    prenom: '',
                                                    date_naissance: '',
                                                    numero_telephone: '',
                                                    adresse_1: '',
                                                    adresse_2: '',
                                                    code_postal: 0,
                                                    ville: '',
                                                    ca_annuel_max: 0,
                                                    taux_charge: 0,
                                                    administrator: false
                                                   })

    const handleChange =  (event) => {
        formHandleChange(event, credentials, setCredentials)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(credentials.numero_telephone.length !== 10) {
            console.log("erreur tel > 10")
            toast.warning("Le numéro de téléphone doit faire 10 caractères")
        }
        else if(regexnumerotelephone.exec(credentials.numero_telephone) === null) {
            toast.warning("Le numéro de téléphone doit être composé uniquement de chiffres au format français")
        }
        else if(credentials.code_postal.length !== 5) {
            toast.warning("Le code postal doit faire 5 caractères")
        }
        else if(regexcodepostal.exec(credentials.code_postal) === null) {
            toast.warning("Le code postal doit être composé uniquement de chiffres")
        }
        else if(credentials.ca_annuel_max < 0) {
            toast.warning("Le CA annuel ne doit pas être inférieur à 0")
        }
        else if(credentials.taux_charge < 0) {
            toast.warning("Le taux de charge ne doit pas être inférieur à 0")
        }
        else if(credentials.taux_charge > 100) {
            toast.warning("Le taux de charge ne doit pas être supérieur à 100")
        }
        else if(await getUserByEmail(credentials.email) !== ""){
            toast.warning("Cette adresse email est déjà utilisée")
        }
        else {
            console.log (credentials)
            await insertUser(credentials.email,
                             credentials.pwd,
                             credentials.nom,
                             credentials.prenom,
                             credentials.date_naissance,
                             credentials.numero_telephone,
                             credentials.adresse_1,
                             credentials.adresse_2,
                             credentials.code_postal,
                             credentials.ville,
                             credentials.ca_annuel_max,
                             credentials.taux_charge,
                             credentials.administrator)
            console.log('submit !')
            props.history.push('/login')
        }
    }

    return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className={`row ${styles.row}`}>
                        <h1 className="mt-3" style={{textAlign: 'center'}}>Création de compte</h1>
                        <div className="col-5 offset-2">
                            <InputLabel name="email" className="form-control my-3 p-2" value={credentials.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@mail.fr" required="true"/>
                            <InputLabel name="nom" className="form-control my-3 p-2" value={credentials.nom} change={handleChange} type="text" label="Nom" placeholder="DUPONT" required="true"/>
                            <InputLabel name="date_naissance" className="form-control my-3 p-2" value={credentials.date_naissance} change={handleChange} type="date" label="Date de naissance" placeholder="01/01/1901" required="true"/>
                            <InputLabel name="adresse_1" className="form-control my-3 p-2" value={credentials.adresse_1} change={handleChange} type="text" label="Adresse postale" placeholder="12 rue du paradis" required="true"/>
                            <InputLabel name="code_postal" className="form-control my-3 p-2" value={credentials.code_postal} change={handleChange} type="number" label="Code postal" placeholder="13000" required="true" pattern="[0-9]"/>
                            <InputLabel name="ca_annuel_max" className="form-control my-3 p-2" value={credentials.ca_annuel_max} change={handleChange} type="number" label="CA annuel max" placeholder="100000" required="true"/>
                        </div>
                        <div className="col-5">
                            <InputLabel name="pwd" className="form-control my-3 p-2" value={credentials.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                            <InputLabel name="prenom" className="form-control my-3 p-2" value={credentials.prenom} change={handleChange} type="text" label="Prenom" placeholder="Pierre" required="true"/>
                            <InputLabel name="numero_telephone" className="form-control my-3 p-2" value={credentials.numero_telephone} change={handleChange} type="number" label="Numéro de téléphone" placeholder="0601020304" required="true"/>
                            <InputLabel name="adresse_2" className="form-control my-3 p-2" value={credentials.adresse_2} change={handleChange} type="text" label="Complément d'adresse" placeholder="Batiment B"/>
                            <InputLabel name="ville" className="form-control my-3 p-2" value={credentials.ville} change={handleChange} type="text" label="Ville" placeholder="Marseille" required="true"/>
                            <InputLabel name="taux_charge" className="form-control my-3 p-2" value={credentials.taux_charge} change={handleChange} type="number" label="Taux de charge" placeholder="20" required="true"/>
                        </div>
                        <div className="form-row">
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary mt-1 w-100">Enregistrer</button>
                            </div>
                        </div>
                            <p className="mt-1 text-center">Déjà un compte ? <a href="/login">Se connecter</a></p>
                    </div>
                </form>   
            </div>
    )
}