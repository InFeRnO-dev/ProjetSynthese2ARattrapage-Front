import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import FactureLine from '../../components/facture/factureLine'
import Nav from '../../components/header/nav'
import { getAllFacture } from '../../services/api/facture/factureapi'
import { isAuthorized } from '../../services/userService'

export default function Facture() {
    const [factures, setfactures] = useState([])

    async function getAllFactures(){
        const facture = await getAllFacture()
        setfactures(facture)
    }

    useEffect(() => {
        getAllFactures()
    }, [])

    return isAuthorized() ?(
        <>
            <Nav/>
            <div className="container mt-3">
                <h1 className="text-center">Liste des factures</h1>
                <div className="row mt-5 border-bottom">
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Etat</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Numéro</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Projet</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Client</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Prix Total</p>
                    </div>
                    <div className="col-2">
                        <p style={{fontFamily: 'arial black'}}>Options</p>
                    </div>
                </div>
                {factures.map((linkData) => {return <FactureLine key={linkData.id_entete_facture} index={linkData.id_entete_facture} facture={linkData}/>})}
            
            </div>
        </>
    ) : (
        <Redirect to='/login'/>
    )
}
