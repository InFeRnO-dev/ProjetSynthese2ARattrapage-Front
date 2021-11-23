import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import ClientLine from '../../components/client/clientLine'
import InputLabel from '../../components/form/inputLabel'
import Nav from '../../components/header/nav'
import { getAllClientByEmailUser, getClientsBySearch } from '../../services/api/client/clientapi'
import { formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService'

export default function Client() {
    const [search, setsearch] = useState({search: ""})
    const [clients, setclients] = useState([])
    const [datamodif, setdatamodif] = useState(false)
    const [render, setrender] = useState()

    async function getClients(){
        if(search.search.trim() === ""){
            setclients(await getAllClientByEmailUser())
            setdatamodif(true)
            setrender(<>{clients.map((linkData, index) => {return <ClientLine key={index} index={linkData.id_client} client={linkData}/>})}</>)
        }
        else{
            const clients = (await getClientsBySearch(search.search)).data
            if(clients !== undefined && clients.length > 0){
                setclients(clients)
                setrender(<>{clients.map((linkData, index) => {return <ClientLine key={index} index={linkData.id_client} client={linkData}/>})}</>)
                setdatamodif(true)
            }
            else {
                setrender(<><h3>Aucun client ne correspond a votre recherche</h3></>)
            }
        }
    }

    const handleChange =  (event) => {
        formHandleChange(event, search, setsearch)
    }

    const handleSubmit =  (event) => {
        setdatamodif(false)
        event.preventDefault()
        getClients()
    }

    useEffect(() => {
        getClients()
    }, [datamodif])



    return isAuthorized() ?(
        <>
            <Nav/>
            <div className="container mt-3">
                <h1 className="text-center">Liste des clients</h1>
                <form onSubmit={handleSubmit}>
                    <div className="row mt-3">
                        <div className="col-9 offset-1">
                            <input name="search" className="form-control" value={search.search} onChange={handleChange} type="text" label="Rechercher" placeholder="Nom, Prenom, Contact, Ville, Email, N° Téléphone...."/>
                        </div>
                        <div className="col">
                            <button type='submit' className="btn btn-info">Rechercher</button>
                        </div>            
                    </div>
                </form>
                <div className="row mt-5 border-bottom">
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Nom</p>
                    </div>
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Prenom / Nom de contact</p>
                    </div>
                    <div className="col-3">
                        <p style={{fontFamily: 'arial black'}}>Email</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Options</p>
                    </div>
                </div>
                {render}
                    
            </div>
        </>
    ) : (
        <>
            <Redirect to='/login'/>
        </>
    )
}
