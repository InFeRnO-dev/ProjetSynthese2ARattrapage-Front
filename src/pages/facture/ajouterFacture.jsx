import React, { useEffect, useState } from 'react'
import { Redirect, useHistory } from 'react-router'
import InputLabel from '../../components/form/inputLabel'
import Nav from '../../components/header/nav'
import { getAllEtatFacture } from '../../services/api/facture/etatfactureapi'
import { getNumeroFactureMax, insertFacture } from '../../services/api/facture/factureapi'
import { formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { getAllMoyenPaiement } from '../../services/api/facture/moyenpaiementfactureapi'
import { getAllProjet } from '../../services/api/projet/projetapi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
toast.configure()

export default function AjouterFacture() {
    const [numerofacture, setnumerofacture] = useState()
    const [facture, setfacture] = useState({numero_facture: 0,
                                            date_edition: "",
                                            date_paiement_limite: "",
                                            date_paiement_effectif: "",
                                            note: "",
                                            id_etat: 1,
                                            id_paiement: 1,
                                            id_projet: 1,
                                            })
    const [optionsprojet, setoptionprojet] = useState([])
    const [optionsetatfacture, setoptionsetatfacture] = useState([])
    const [optionsmoyenpaiement, setoptionmoyenpaiement] = useState([])
    const history = useHistory()
    async function getAll(){
        await getNumeroFacture()
        await getProjets()
        await getEtatFactures()
        await getMoyenPaiement()
    }

    async function getProjets(){
        const projet = await getAllProjet(0,0)
        setoptionprojet(projet)
    }

    async function getEtatFactures(){
        const etat = await getAllEtatFacture()
        setoptionsetatfacture(etat[0])
    }

    async function getMoyenPaiement(){
        const moyenpaiement = await getAllMoyenPaiement()
        setoptionmoyenpaiement(moyenpaiement)
    }

    async function getNumeroFacture(){
        const numero = (await getNumeroFactureMax()).numero_facture
        setnumerofacture(numero)
        setfacture({...facture, ['numero_facture']: numero + 1})
    }

    const handleChange =  (event) => {
        formHandleChange(event, facture, setfacture)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if(parseInt(facture.numero_facture) <= numerofacture){
            toast.warning("Le numero de facture doit être supérieur à " + numerofacture)
        }
        else if(facture.date_edition === "" || facture.date_edition === null || facture.date_edition === undefined){
            toast.warning("Veuillez saisir la date d'édition")
        }
        else if(facture.date_paiement_limite === "" || facture.date_paiement_limite === null || facture.date_paiement_limite === undefined){
            toast.warning("Veuillez saisir la date de paiement limite")
        }
        else if(facture.id_etat === 0){
            toast.warning("Veuillez saisir un état de facture dans la liste déroulante")
        }
        else if(facture.id_paiement === 0){
            toast.warning("Veuillez saisir un moyen de paiement dans la liste déroulante")
        }
        else if(facture.id_projet === 0){
            toast.warning("Veuillez saisir un projet dans la liste déroulante")
        }
        else{
            await insertFacture(facture.numero_facture, facture.date_edition, facture.date_paiement_limite, facture.date_paiement_effectif, facture.note, facture.id_paiement, facture.id_etat, facture.id_projet)
            toast.success("La facture a été ajoutée !")
            history.push('/facture')
        }
        
        
    }

    const onSelectEtat = (event) =>{
        setfacture({ ...facture, ["id_etat"]: event.target.value})
    }

    const onSelectMoyenPaiement = (event) =>{
        setfacture({ ...facture, ["id_paiement"]: event.target.value})
    }

    const onSelectProjet = (event) =>{
        setfacture({ ...facture, ["id_projet"]: event.target.value})
    }

    useEffect(() => {
        getAll()
    }, [])

    return isAuthorized() ?(
        <>
            <Nav/>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1 className="mt-3" style={{textAlign: 'center'}}>Ajout d'une facture</h1>
                    <div className="row mt-3">
                        <div className="col-3 offset-1 mt-4">
                            <Select
                            labelId="ProjetLabel"
                            id="SelectProjet"
                            defaultValue={facture.id_projet}
                            label="Projet"
                            onChange={onSelectProjet}
                            >
                            {optionsprojet.map((projet) => {
                                return <MenuItem value={projet.id_projet}>{projet.nom}</MenuItem>
                            })}
                            </Select>
                            <FormHelperText>Projet</FormHelperText>
                        </div>
                        <div className="col-3 mt-4">
                            <Select
                            labelId="EtatLabel"
                            id="SelectEtat"
                            defaultValue={facture.id_etat}
                            label="Etat"
                            onChange={onSelectEtat}
                            >
                            <MenuItem value={optionsetatfacture.id_etat_facture}>{optionsetatfacture.etat}</MenuItem>
                            
                        </Select>
                        <FormHelperText>Etat</FormHelperText>
                        </div>
                        <div className="col-5 mt-4">
                            <Select
                            labelId="MoyenPaiementLabel"
                            id="SelectMoyenPaiement"
                            defaultValue={facture.id_paiement}
                            label="Moyen de Paiement"
                            onChange={onSelectMoyenPaiement}
                            >
                            {optionsmoyenpaiement.map((moyen) => {
                                return <MenuItem value={moyen.id_moyen_paiement_facture}>{moyen.moyen_paiement}</MenuItem>
                            })}
                        </Select>
                        <FormHelperText>Moyen de paiement</FormHelperText>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-5 offset-1">
                            <InputLabel name="numero_facture" className="form-control my-4 p-2" value={facture.numero_facture} change={handleChange} type="text" label="Numero de facture" required="true"/> 
                        </div>
                        <div className="col-5">
                            <InputLabel name="date_edition" className="form-control my-4 p-2" value={facture.date_edition} change={handleChange} type="date" label="Date d'edition" required="true"/> 
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-5 offset-1">
                            <InputLabel name="date_paiement_limite" className="form-control my-4 p-2" value={facture.date_paiement_limite} change={handleChange} type="date" label="Date de paiement limite" required="true"/> 
                        </div>
                        <div className="col-5">
                            <InputLabel name="date_paiement_effectif" className="form-control my-4 p-2" value={facture.date_paiement_effectif} change={handleChange} type="date" label="Date de paiement effectif"/> 
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-5 offset-1">
                            <div class="form-group">
                                <label htmlFor="note">Note de bas de page</label>
                                <textarea className="form-control my-4 p-2" value={facture.note} onChange={handleChange} name="note" id="note" rows="3"></textarea>
                            </div>
                        </div>
                        <div className="col-5 mt-5">
                            <button type="submit" className="btn btn-primary w-100 mt-2">Ajouter</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    ) : (
        <Redirect to='/login'/>
    )
}
