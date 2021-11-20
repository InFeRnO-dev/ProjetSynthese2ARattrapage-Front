import React, { useEffect, useState } from 'react'
import { formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService'
import { getAllClientByEmailUser } from '../../services/api/client/clientapi'
import { getAllStatut } from '../../services/api/projet/statutapi'
import InputLabel from '../../components/form/inputLabel'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Redirect } from 'react-router'
import { deleteProjet, updateProjet } from '../../services/api/projet/projetapi'
toast.configure()

export default function ProjetLine(props) {
    console.log(props)
    const [projet, setprojet] = useState({nom: props.projet.nom, id_statut: props.projet.id_statut, id_client: props.projet.id_client})
    const [optionsClient, setoptionsClient] = useState([])
    const [optionsStatut, setoptionsStatut] = useState([])

    const getAll = () => {
        getAllStatuts()
        getAllClients()
    }

    async function getAllClients(){
        const client = await getAllClientByEmailUser()
        setoptionsClient(client)
    }

    async function getAllStatuts(){
        const statut = await getAllStatut()
        setoptionsStatut(statut)
    }

    const handleChange =  (event) => {
        formHandleChange(event, projet, setprojet)
    }

    const handleSubmitEdit = async (event) => {
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
            await updateProjet(props.projet.id_projet, projet.nom, projet.id_client, projet.id_statut)
            toast.success("Le projet a été modifié !")
            {<Redirect to='/projet'/>}
        }
    }

    const handleSubmitDelete = async (event) => {
        event.preventDefault()
        await deleteProjet(props.projet.id_projet)
        toast.success("Le projet a été supprimé !")

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
            <div className="row border-bottom">
                <div className="col-3 mt-2">
                    <p>{props.projet.nom}</p>
                </div>
                <div className="col-3 mt-2">
                    <p>{props.projet.nom_client}</p>
                </div>
                <div className="col-3 mt-2">
                    <p>{props.projet.label}</p>
                </div>
                <div className="col-3 mt-2">
                    <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target={"#editProjetModal" + props.index}>Modifier</button>
                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target={"#deleteProjetModal" + props.index}>Supprimer</button>
                </div>
            </div>

            <div className="modal fade" id={"editProjetModal" + props.index} tabIndex="-1" aria-labelledby={"editProjetModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"editProjetModalLabel" + props.index}>Modifier un projet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitEdit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-5">
                                <Select
                                    labelId="ClientLabel"
                                    id="SelectClient"
                                    defaultValue={props.projet.id_client}
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
                                    defaultValue={props.projet.id_statut}
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
                            <div className="row">
                                <InputLabel id={"nom" + props.index} name="nom" className="form-control my-3 p-2" value={projet.nom} change={handleChange} type="text" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
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

        <div className="modal fade" id={"deleteProjetModal" + props.index} tabIndex="-1" aria-labelledby={"deleteProjetModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"deleteProjetModalLabel" + props.index}>Supprimer un projet</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitDelete}>
                        <div className="modal-body">
                            Voulez vous vraiment supprimer le projet: {props.projet.nom}
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
        <Redirect to='/login'/>
    )
}
