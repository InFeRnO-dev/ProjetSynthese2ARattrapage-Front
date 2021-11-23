import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import Nav from '../../components/header/nav'
import ProjetLine from '../../components/projet/projetLine'
import { getAllProjet } from '../../services/api/projet/projetapi'
import { isAuthorized } from '../../services/userService'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { getAllClientByEmailUser } from '../../services/api/client/clientapi'
import { getAllStatut } from '../../services/api/projet/statutapi'

export default function Projet(){
    const [projets, setprojets] = useState([])
    const [optionsClient, setoptionsClient] = useState([])
    const [optionsStatut, setoptionsStatut] = useState([])
    const [idclient, setidclient] = useState(0)
    const [idstatut, setidstatut] = useState(4)

    function getAll(){
        getAllStatuts()
        getAllClients()
        getAllProjets(idclient, idstatut)
    }

    async function getAllProjets(selectedidclient, selectedidstatut){
        const projet = await getAllProjet(selectedidclient, selectedidstatut)
        setprojets(projet)
    }

    async function getAllClients(){
        const client = await getAllClientByEmailUser()
        setoptionsClient(client)
    }

    async function getAllStatuts(){
        const statut = await getAllStatut()
        setoptionsStatut(statut)
    }

    const onSelectClient = async (event) =>{
        setidclient(event.target.value)
        await getAllProjets(event.target.value, idstatut)
    }

    const onSelectStatut = async (event) =>{
        setidstatut(event.target.value)
        await getAllProjets(idclient, event.target.value)
    }

    useEffect(() => {
        getAll()
    }, [])

    return isAuthorized() ?(
        <>
            <Nav/>
            <div className="container mt-3">
                <h1 className="text-center">Liste des projets</h1>
                <div className="row mt-3">
                    <div className="col-5 offset-2">
                        <Select
                        labelId="ClientLabel"
                        id="SelectClient"
                        defaultValue={idclient}
                        label="Client"
                        onChange={onSelectClient}
                        >
                        <MenuItem value={0}>{"Tous"}</MenuItem>
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
                        defaultValue={idstatut}
                        label="Statut"
                        onChange={onSelectStatut}
                        >
                        <MenuItem value={0}>{"Tous"}</MenuItem>
                        {optionsStatut.map((statut) => {
                            return <MenuItem value={statut.id_statut}>{statut.label}</MenuItem>
                        })}
                    </Select>
                    <FormHelperText>Statut</FormHelperText>
                    </div>
                </div>
                
                <div className="row mt-5 border-bottom">
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Nom</p>
                    </div>
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Client</p>
                    </div>
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Statut</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Options</p>
                    </div>
                </div>
                {projets.map((linkData) => {return <ProjetLine key={linkData.id_projet} index={linkData.id_projet} projet={linkData}/>})}
            </div>
        </>
    ) : (
        <>
            <Redirect to='/login'/>
        </>
    )
}
