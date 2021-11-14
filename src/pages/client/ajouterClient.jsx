import React, { useState } from 'react'
import InputLabel from '../../components/form/inputLabel'
import { formHandleChange } from '../../services/formService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '../../components/header/nav';
import { insertClient } from '../../services/api/client/clientapi';
import { isAuthorized } from '../../services/userService';
import { Redirect } from 'react-router';
toast.configure()

export default function AjouterClient(props) {
    const regexcodepostal = /^[0-9]{5}$/gm
    const regexnumerotelephone = /^[0-9]{10}$/gm
    const [client, setclient] = useState({nom: '',
                                          type: 'entreprise',
                                          nom_contact: '',
                                          prenom: '',
                                          nom_contact_prenom: '',
                                          adresse_1: '',
                                          adresse_2: '',
                                          code_postal: '',
                                          ville: '',
                                          numero_telephone: '',
                                          email: ''
                                        })

    const handleChange =  (event) => {
        formHandleChange(event, client, setclient)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(client.numero_telephone.length !== 10) {
            console.log("erreur tel > 10")
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
            console.log(client)
            await insertClient(client.nom,
                               client.nom_contact,
                               client.prenom,
                               client.adresse_1,
                               client.adresse_2,
                               client.code_postal,
                               client.ville,
                               client.numero_telephone,
                               client.email)
            console.log('submit !')
            toast.success("Le client a été ajouté !")
            props.history.push('/client')
        }
    }

    return isAuthorized() ?(
        <>
        <Nav/>
        <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1 className="mt-3" style={{textAlign: 'center'}}>Ajout d'un client</h1>
                    <div className="row mt-4">
                        <div className="col offset-5">
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" className="btn-check" value="entreprise" name="btntype" onChange={() => (client.type = 'entreprise', console.log(client.type))} id="btntypeentreprise" autoComplete="off" defaultChecked />
                                <label className="btn btn-outline-primary" htmlFor="btntypeentreprise">Entreprise</label>

                                <input type="radio" className="btn-check" value="personne" name="btntype" onChange={() => (client.type = 'personne', console.log(client.type))} id="btntypepersonne" autoComplete="off" />
                                <label className="btn btn-outline-primary" htmlFor="btntypepersonne">Personne</label>
                            </div>
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
                        <div className="form-row">
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary mt-1 w-100">Ajouter</button>
                            </div>
                        </div>
                    </div>
                </form>   
            </div>
        </>
    ) : (
        <>
            <Redirect to='/login'/>
        </>
    )
}
