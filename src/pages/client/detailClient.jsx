import React, { useEffect, useState } from 'react'
import InputLabel from '../../components/form/inputLabel'
import { formHandleChange } from '../../services/formService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../../components/header/nav';
import { isAuthorized } from '../../services/userService';
import { Redirect } from 'react-router';
import { deleteClient, updateClient } from '../../services/api/client/clientapi';

export default function DetailClient(props) {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    const [render, setrender] = useState()
    const [client, setclient] = useState({nom: props.location.state.client.nom,
                                          type: '',
                                          nom_contact: '',
                                          prenom: '',
                                          nom_contact_prenom: props.location.state.client.nom_contact === null ? props.location.state.client.prenom : props.location.state.client.nom_contact,
                                          adresse_1: props.location.state.client.adresse_1,
                                          adresse_2: props.location.state.client.adresse_2,
                                          code_postal: props.location.state.client.code_postal,
                                          ville: props.location.state.client.ville,
                                          numero_telephone: props.location.state.client.numero_telephone,
                                          email: props.location.state.client.email
                                        })

    const handleChange =  (event) => {
        formHandleChange(event, client, setclient)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(client.numero_telephone.length !== 10) {
            toast.warning("Le numéro de téléphone doit faire 10 caractères")
        }
        else if(regexnumerotelephone.exec(client.numero_telephone) === null) {
            toast.warning("Le numéro de téléphone doit être composé uniquement de chiffres au format français")
        }
        else if(client.code_postal.length !== 5) {
            toast.warning("Le code postal doit faire 5 caractères")
        }
        else if(regexcodepostal.exec(client.code_postal) === null) {
            toast.warning("Le code postal doit être composé uniquement de chiffres")
        }
        else{
            if(client.type === 'entreprise'){
                client.nom_contact = client.nom_contact_prenom
                client.prenom = null
            }
            else{
                client.prenom = client.nom_contact_prenom
                client.nom_contact = null
            }
            await updateClient(client.nom,
                                client.nom_contact,
                                client.prenom,
                                client.adresse_1,
                                client.adresse_2,
                                client.code_postal,
                                client.ville,
                                client.numero_telephone,
                                client.email,
                                props.match.params.id_client)
            toast.success("Le client a été modifié !")
        }
    }

    const handleSubmitDelete = async (event) => {
        event.preventDefault()
        if(await deleteClient(props.match.params.id_client) === false){
            toast.warning(`Le client contient des projets. Suppression impossible !`)
            return
        }
        else{
            toast.success("Le client a été supprimé !")
            props.history.push('/client')
            window.location.reload(false)
        } 
    }

    useEffect(() => {
        
        if(props.location.state.client.nom_contact === null) {
            client.type = 'personne'
            setrender(<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" value="entreprise" name="btntype" onChange={() => client.type = 'entreprise'} id="btntypeentreprise" autoComplete="off"  />
                        <label className="btn btn-outline-primary" htmlFor="btntypeentreprise">Entreprise</label>

                        <input type="radio" className="btn-check" value="personne" name="btntype" onChange={() => client.type = 'personne'} id="btntypepersonne" autoComplete="off" defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor="btntypepersonne">Personne</label>
                    </div>)
        }
        else {
            client.type = 'entreprise'
            setrender(<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" value="entreprise" name="btntype" onChange={() => client.type = 'entreprise'} id="btntypeentreprise" autoComplete="off" defaultChecked />
                        <label className="btn btn-outline-primary" htmlFor="btntypeentreprise">Entreprise</label>

                        <input type="radio" className="btn-check" value="personne" name="btntype" onChange={() => client.type = 'personne'} id="btntypepersonne" autoComplete="off" />
                        <label className="btn btn-outline-primary" htmlFor="btntypepersonne">Personne</label>
                    </div>)
        }
    }, [])

    return isAuthorized() ?(
        <>
        <Nav/>
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1 className="mt-3" style={{textAlign: 'center'}}>Détail du client</h1>
                <div className="row mt-4">
                    <div className="col offset-5">
                        {render}
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-5 offset-2">
                        <InputLabel name="nom" className="form-control my-3 p-2" value={client.nom} change={handleChange} type="text" label="Nom" placeholder="DUPONT" required="true"/>
                        <InputLabel name="adresse_1" className="form-control my-3 p-2" value={client.adresse_1} change={handleChange} type="text" label="Adresse postale" placeholder="12 rue du paradis" required="true"/>
                        <InputLabel name="code_postal" className="form-control my-3 p-2" value={client.code_postal} change={handleChange} type="number" label="Code postal" placeholder="13000" required="true" pattern="[0-9]"/>
                        <InputLabel name="numero_telephone" className="form-control my-3 p-2" value={client.numero_telephone} change={handleChange} type="number" label="Numéro de téléphone" placeholder="0601020304" required="true"/>
                    </div>
                    <div className="col-5">
                        <InputLabel name="nom_contact_prenom" className="form-control my-3 p-2" value={client.nom_contact_prenom} change={handleChange} type="text" label="Nom de contact / Prenom" placeholder="Airbus / Pierre" required="true"/>
                        <InputLabel name="adresse_2" className="form-control my-3 p-2" value={client.adresse_2} change={handleChange} type="text" label="Complément d'adresse" placeholder="Batiment B"/>
                        <InputLabel name="ville" className="form-control my-3 p-2" value={client.ville} change={handleChange} type="text" label="Ville" placeholder="Marseille" required="true"/>
                        <InputLabel name="email" className="form-control my-3 p-2" value={client.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@mail.fr" required="true"/>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <button type="submit" className="btn btn-primary mt-1 w-100">Modifier</button>
                        </div>
                        <div className="col-6">
                            <button type='button' className="btn btn-danger mt-1 w-100" data-bs-toggle="modal" data-bs-target={"#deleteClientModal" + props.index}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </form>   
        </div>


        <div className="modal fade" id={"deleteClientModal" + props.index} tabIndex="-1" aria-labelledby={"deleteClientModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"deleteClientModalLabel" + props.index}>Supprimer un client</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitDelete}>
                        <div className="modal-body">
                            Voulez vous vraiment supprimer le client {props.location.state.client.nom + " " + (props.location.state.client.nom_contact === null ? props.location.state.client.prenom : props.location.state.client.nom_contact)}
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
        <>
            <Redirect to='/login'/>
        </>
    )
}
