import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LigneFactureLine from '../../components/facture/ligneFactureLine'
import InputLabel from '../../components/form/inputLabel'
import Nav from '../../components/header/nav'
import { getAllLigneFactureByIdFacture, insertLigneFacture } from '../../services/api/facture/lignefactureapi'
import { formHandleChange } from '../../services/formService'
import { isAuthorized } from '../../services/userService';
import { Redirect } from 'react-router'
toast.configure()

export default function DetailFacture(props) {
    const [lignefacture, setlignefacture] = useState({libelle: "", quantite: 0, prix_unitaire: 0})
    const [prixtotal, setprixtotal] = useState(0)
    const facture = props.location.state.facture
    const [lignesfacture, setlignesfacture] = useState([])
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}

    async function getAllLignesFacture(){
        const lignes = await getAllLigneFactureByIdFacture(facture.id_entete_facture)
        setlignesfacture(lignes)
        calculPrixTotal(lignes)
    }

    function calculPrixTotal(lignes){
        let calcul = prixtotal
        lignes.map((ligne) => {
            calcul +=(ligne.quantite * ligne.prix_unitaire)
        })
        setprixtotal(parseFloat(calcul).toFixed(2))
    }

    const handleChange =  (event) => {
        formHandleChange(event, lignefacture, setlignefacture)
    }

    const handleSubmitAdd =  async (event) => {
        event.preventDefault()
        if(lignefacture.libelle !== null && lignefacture.libelle !== undefined && lignefacture.libelle !== ""){
            if(lignefacture.quantite >= 1 && lignefacture.quantite !== null && lignefacture.quantite !== undefined){
                if(lignefacture.prix_unitaire > 0 && lignefacture.prix_unitaire !== null && lignefacture.prix_unitaire !== undefined){
                    await insertLigneFacture(lignefacture.libelle, lignefacture.quantite, parseFloat(lignefacture.prix_unitaire).toFixed(2), facture.id_entete_facture)
                    toast.success("Ligne ajoutée !")
                    window.location.reload(false)
                }
                else{
                    toast.warning("Veuillez saisir le prix unitaire")
                }
            }
            else{
                toast.warning("Veuillez saisir une quantité")
            }
        }
        else{
            toast.warning("Veuillez saisir le libelle")
        }
    }

    useEffect(() => {
        getAllLignesFacture()
    }, [])
    

    return isAuthorized() ?(
        <>
        <Nav/>
        <div style={{marginTop: "10px", background:"#eee"}}>
        <div className="container bootdey">
            <div className="row invoice row-printable">
                <div className="col-md-12">
                    <div className="panel panel-default plain" id="dash_0">
                        <div className="panel-body p30">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="invoice-logo"><img width="100" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Invoice logo"/></div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="invoice-from">
                                        <ul className="list-unstyled text-end">
                                            <li>{facture.nom_user} {facture.prenom_user}</li>
                                            <li>{facture.email_user} / {facture.numero_telephone_user}</li>
                                            <li>{facture.adresse_1_user}</li>
                                            <li>{facture.adresse_2_user}</li>
                                            <li>{facture.code_postal_user} {facture.ville_user}</li>
                                            
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="invoice-details mt25">
                                        <div className="well">
                                            <ul className="list-unstyled mb0">
                                                <li><strong>Numero de facture : </strong>{facture.numero_facture}</li>
                                                <li><strong>Date d'édition : </strong>{new Date(facture.date_edition).toLocaleDateString('fr-FR', options)}</li>
                                                <li><strong>Date de paiement limite : </strong>{new Date(facture.date_paiement_limite).toLocaleDateString('fr-FR', options)}</li>
                                                <li><strong>Status : </strong> <span className="">{facture.etat}</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="invoice-to mt25">
                                        <ul className="list-unstyled">
                                            <li><strong>Client :</strong></li>
                                            <li>{facture.nom_client}</li>
                                            <li>{facture.nom_contact_client === null ? facture.prenom_client : facture.nom_contact_client}</li>
                                            <li>{facture.email_client} / {facture.numero_telephone_client}</li>
                                            <li>{facture.adresse_1_client}</li>
                                            <li>{facture.adresse_2_client}</li>
                                            <li>{facture.code_postal_client} {facture.ville_client}</li>
                                        </ul>
                                    </div>
                                    <div className="invoice-items">
                                        <div className="table-responsive" style={{overflow: "hidden", outline: "none"}} tabIndex="0">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {facture.id_etat !== 3 ?
                                                            <>
                                                            <th className="per5 text-center"><button className='btn btn-primary' data-bs-toggle="modal" data-bs-target={"#addLigneFactureModal" + props.index}><i className="bi bi-plus-circle"></i></button></th>
                                                            <th className="per70 text-center">Description</th>
                                                            <th className="per5 text-center">Quantité</th>
                                                            <th className="per25 text-center">Prix unitaire</th>
                                                            <th className="per25 text-center">Prix total</th>
                                                            </>
                                                            :
                                                            <>
                                                            <th className="per70 text-center">Description</th>
                                                            <th className="per5 text-center">Quantité</th>
                                                            <th className="per25 text-center">Prix unitaire</th>
                                                            <th className="per25 text-center">Prix total</th>
                                                            </>
                                                        }
                                                    </tr>
                                                </thead>
                                                    <tbody>
                                                        {lignesfacture.map((linkData) => {return <LigneFactureLine key={linkData.id_entete_facture} index={linkData.id_entete_facture} id_etat={facture.id_etat} lignefacture={linkData}/>})}
                                                    </tbody>
                                                <tfoot>
                                                {facture.id_etat !== 3 ?
                                                    <>
                                                    <tr>
                                                        <th colSpan="4" className="text-end">Sous Total :</th>
                                                        <th className="text-center">{prixtotal}€</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="4" className="text-end">Taux de charge :</th>
                                                        <th className="text-center">{facture.taux_charge}%</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="4" className="text-end">Total :</th>
                                                        <th className="text-center">{parseFloat(prixtotal + (prixtotal * (facture.taux_charge / 100))).toFixed(2)}€</th>
                                                    </tr>
                                                    </>
                                                    :
                                                    <>
                                                    <tr>
                                                        <th colSpan="3" className="text-end">Sous Total :</th>
                                                        <th className="text-center">{prixtotal}€</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3" className="text-end">Taux de charge :</th>
                                                        <th className="text-center">{facture.taux_charge}%</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3" className="text-end">Total :</th>
                                                        <th className="text-center">{parseFloat(prixtotal + (prixtotal * (facture.taux_charge / 100))).toFixed(2)}€</th>
                                                    </tr>
                                                    </>
                                                }
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="invoice-footer mt25">
                                        <p>Note : {facture.note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>


        <div className="modal fade" id={"addLigneFactureModal" + props.index} tabIndex="-1" aria-labelledby={"addLigneFactureModalLabel" + props.index} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={"addLigneFactureModalLabel" + props.index}>Ajouter une ligne</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmitAdd}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"libelle" + props.index} name="libelle" className="form-control my-3 p-2" value={lignefacture.libelle} change={handleChange} type="text" label="Libelle" placeholder="Article" required="true"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"quantite" + props.index} name="quantite" className="form-control my-3 p-2" value={lignefacture.quantite} change={handleChange} type="number" label="Quantite" placeholder="0" required="true"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <InputLabel id={"prix_unitaire" + props.index} name="prix_unitaire" className="form-control my-3 p-2" value={lignefacture.prix_unitaire} change={handleChange} type="number" label="Prix unitaire" placeholder="0" required="true"/>
                                </div>
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




    </>
    ) : (
        <Redirect to='/login' />
    )
}
