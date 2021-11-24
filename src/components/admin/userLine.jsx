import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Redirect } from 'react-router'
import { formatDate, formHandleChange } from '../../services/formService';
import InputLabel from '../form/inputLabel'
import { deleteUser, updateUser, getUserByEmail } from '../../services/api/admin/userapi';
import { toast } from 'react-toastify';
import { isAuthorized } from '../../services/userService';
toast.configure()

export default function UserLine(props) {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    let history = useHistory()
    const [render, setrender] = useState()
    const [email, setemail] = useState(props.user.email)
    const [credentials, setCredentials] = useState({email: props.user.email, 
                                                    pwd: '',
                                                    confpwd: '',
                                                    nom: props.user.nom,
                                                    prenom: props.user.prenom,
                                                    date_de_naissance: formatDate(props.user.date_de_naissance),
                                                    numero_telephone: props.user.numero_telephone,
                                                    adresse_1: props.user.adresse_1,
                                                    adresse_2: props.user.adresse_2,
                                                    code_postal: props.user.code_postal,
                                                    ville: props.user.ville,
                                                    ca_annuel_max: props.user.ca_annuel_max,
                                                    taux_charge: props.user.taux_charge,
                                                    administrator: props.user.administrator
                                                    })
    
    const handleChange =  (event) => {
        formHandleChange(event, credentials, setCredentials)
    }

    const handleSubmitEdit = async (event) => {
        event.preventDefault()
        if(credentials.numero_telephone.length !== 10) {
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
        if(email !== credentials.email){
            const temp = await getUserByEmail(credentials.email)
            if(temp !== ""){
                toast.warning("Cette adresse email est déjà utilisée")
                return
            }
        }
        if(credentials.pwd !== credentials.confpwd){
            toast.warning("Les mots de passe ne correspondent pas")
            return
        }
        await updateUser(credentials.email,
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
                            credentials.administrator,
                            email)
        toast.success("Modification effectuée.")
        history.push("/admin")
        window.location.reload(false)
    }
    const handleSubmitDelete = async (event) => {
        event.preventDefault()
        if(await deleteUser(props.user.email) === false){
            toast.warning(`L'utilisateur contient des clients. Suppression impossible !`)
            return
        }else{
            toast.success(`L'utilisateur a été supprimé`)
            history.push("/admin")
            window.location.reload(false)
        }
    }

    useEffect(() => {
        
        if(props.user.administrator === true) {
            props.user.administrator = true
            setrender(<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" value="Oui" name="btntype" onChange={() => credentials.administrator = true } id={"btnadminouiedit" + props.index} autoComplete="off" defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor={"btnadminouiedit" + props.index}>Oui</label>

                        <input type="radio" className="btn-check" value="Non" name="btntype" onChange={() => credentials.administrator = false } id={"btnadminnonedit" + props.index} autoComplete="off" />
                        <label className="btn btn-outline-primary" htmlFor={"btnadminnonedit" + props.index}>Non</label>
                    </div>)
        }
        else {
            props.user.administrator = false
            setrender(<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" value="Oui" name="btntype" onChange={() => credentials.administrator = true } id={"btnadminouiedit" + props.index} autoComplete="off" />
                        <label className="btn btn-outline-primary" htmlFor={"btnadminouiedit" + props.index}>Oui</label>

                        <input type="radio" className="btn-check" value="Non" name="btntype" onChange={() => credentials.administrator = false } id={"btnadminnonedit" + props.index} autoComplete="off" defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor={"btnadminnonedit" + props.index}>Non</label>
                    </div>)
        }
    }, [])

    return isAuthorized() ?(

        <>
        <div className="row border-bottom">
            <div className="col-3 mt-2">
                <p>{props.user.email}</p>
            </div>
            <div className="col-3 mt-2">
                <p>{props.user.nom + " " + props.user.prenom}</p>
            </div>
            {props.user.administrator === true &&
                <div className="col-2 mt-2">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" checked disabled />
                        <label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
                            Administrateur
                        </label>
                    </div>
                </div>
            }
            {props.user.administrator === false &&
                <div className="col-2 mt-2">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckCheckedDisabled" disabled />
                        <label className="form-check-label" htmlFor="flexCheckCheckedDisabled">
                            Administrateur
                        </label>
                    </div>
                </div>
            }
            <div className="col-3 mt-2">
                <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target={"#editcredentialsModal" + props.index}>Modifier</button>
                <button className=" btn btn-danger" data-bs-toggle="modal" data-bs-target={"#deletecredentialsModal" + props.index}>Supprimer</button>
            </div>
        </div>

        <div className="modal fade" id={"editcredentialsModal" + props.index} tabIndex="-1" aria-labelledby={"editcredentialsModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"editcredentialsModalLabel" + props.index}>Modifier un utilisateur</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitEdit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"email" + props.index} name="email" className="form-control my-3 p-2" value={credentials.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"pwd" + props.index} name="pwd" className="form-control my-3 p-2" value={credentials.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                                    </div>
                                <div className="col-6">
                                    <InputLabel id={"confpwd" + props.index} name="confpwd" className="form-control my-3 p-2" value={credentials.confpwd} change={handleChange} type="password" label="Confirmation du mot de passe" placeholder="********" required="true"/>
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
                            {render}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" className="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div className="modal fade" id={"deletecredentialsModal" + props.index} tabIndex="-1" aria-labelledby={"deletecredentialsModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"deletecredentialsModalLabel" + props.index}>Supprimer un utilisateur</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitDelete}>
                        <div className="modal-body">
                            Voulez vous vraiment supprimer l'utilisateur {props.user.nom + " " + props.user.prenom}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button type="submit" className="btn btn-danger">Supprimer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    ) : (
        <Redirect to='/login' />
    )
}
