import React, { useEffect, useState } from 'react'
import Nav from '../../components/header/nav'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService'
import { Redirect } from 'react-router'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { getAllClientByEmailUser } from '../../services/api/client/clientapi'
import { getAllStatut } from '../../services/api/projet/statutapi'
import InputLabel from '../../components/form/inputLabel'
import { insertProjet } from '../../services/api/projet/projetapi'
toast.configure()

export default function AjouterProjet(props) {
    const [projet, setprojet] = useState({nom: '', id_statut: 1, id_client: 1})
    const [optionsClient, setoptionsClient] = useState([])
    const [optionsStatut, setoptionsStatut] = useState([])

    function getAll(){
        getAllStatuts()
        getAllClients()
    }

    async function getAllClients(){
        const client = await getAllClientByEmailUser()
        console.log(client)
        setoptionsClient(client)
    }

    async function getAllStatuts(){
        const statut = await getAllStatut()
        console.log(statut)
        setoptionsStatut(statut)
    }

    const handleChange =  (event) => {
        formHandleChange(event, projet, setprojet)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(projet.nom === null || projet.nom === undefined || projet.nom === "")
        {
            toast.warning("Saisie du nom invalide")
        }
        else if(projet.id_client === 0){
            toast.warning("Veuillez saisir un client dans la liste déroulante")
        }
        else if(projet.id_statut === 0){
            toast.warning("Veuillez saisir un statut dans la liste déroulante")
        }
        else {
            console.log(projet.nom, projet.id_client, projet.id_statut)
            await insertProjet(projet.nom, projet.id_client, projet.id_statut)
            toast.success("Le projet a été ajouté !")
            props.history.push('/projet')
        }
    }
    const onSelectClient = (event) =>{
        setprojet({ ...projet, ["id_client"]: event.target.value})
    }

    const onSelectStatut = (event) =>{
        setprojet({ ...projet, ["id_statut"]: event.target.value})
    }

    useEffect(() => {
        getAll()
    }, [])
    return isAuthorized() ?(
        <>
            <Nav/>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1 className="mt-3" style={{textAlign: 'center'}}>Ajout d'un projet</h1>
                    <div className="row mt-3">
                        <div className="col-5 offset-1">
                            <Select
                            labelId="ClientLabel"
                            id="SelectClient"
                            defaultValue={projet.id_client}
                            label="Client"
                            onChange={onSelectClient}
                            >
                            {optionsClient.map((client) => {
                                return <MenuItem value={client.id_client}>{client.nom}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>Client</FormHelperText>
                        </div>
                        <div className="col-5">
                            <Select
                            labelId="StatutLabel"
                            id="SelectStatut"
                            defaultValue={projet.id_statut}
                            label="Statut"
                            onChange={onSelectStatut}
                            >
                            {optionsStatut.map((statut) => {
                                return <MenuItem value={statut.id_statut}>{statut.label}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>Statut</FormHelperText>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-5 offset-1">
                            <InputLabel name="nom" className="form-control my-4 p-2" value={projet.nom} change={handleChange} type="text" label="Nom" placeholder="Projet X" required="true"/> 
                        </div>
                        <div className="col-5">
                            <button type="submit" className="btn btn-primary w-100 my-5 p-2">Ajouter</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    ) : (
        <Redirect to='/login'/>
    )
}
