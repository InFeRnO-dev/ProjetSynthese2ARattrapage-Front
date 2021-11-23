import React, { useEffect, useState } from 'react'
import { Redirect } from "react-router-dom";
import Nav from '../components/header/nav';
import { getUserByEmail, JWTDecode } from '../services/api/admin/userapi';
import { getInStore, TOKEN_KEY } from '../services/store';
import { isAuthorized } from '../services/userService';
import { formatDate } from '../services/formService'
import { getCAannuel } from '../services/api/dashboardapi';

export default function Home(){
  const [dateday, setdateday] = useState(new Date())
  const [CAdate, setCAdate] = useState(dateday.toLocaleDateString('fr-FR', {year: 'numeric'}))
  const [user, setuser] = useState({})
  const [CA, setCA] = useState({})

  async function getCA(date){
    const ca = await getCAannuel(date)
    setCA(ca)
  }

  async function getUser(){
      let user = await getUserByEmail(JWTDecode(getInStore(TOKEN_KEY)).login.email)
      user.date_de_naissance = formatDate(user.date_de_naissance)
      setuser(user)
  }

  const anneePrecedente = () => {
    const precedente = CAdate - 1
    setCAdate(precedente);
    getCA(precedente)
  }

  const anneeSuivante = () => {
    const suivante = CAdate + 1
    setCAdate(suivante)
    getCA(suivante)
  }

  useEffect(() => {
    getUser()
    getCA(CAdate)
  }, [])

  return isAuthorized() ?(
    <>
      <Nav/>
      <div className="container">
        <div className="row mt-3">
          <div className="card border-info mb-3" style={{maxWidth: "24rem"}}>
            <div className="card-header"><b className="">Chiffre d'affaire {CAdate} </b></div>
            <div className="card-body">
              <p className="card-text">CA annuel: €{CA.ca_annuel}</p>
              <p className="card-text">Paiements en attente: €{CA.paiements_attente}</p>
              <p className="card-text">A Facturer: €{CA.a_facturer}</p>
              <p className="card-text">CA annuel max: €{(parseFloat(user.ca_annuel_max).toFixed(2))}</p>
              <p className="card-text">CA restant: €{((parseFloat(user.ca_annuel_max) - CA.ca_annuel).toFixed(2))}</p>
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-6">
                  <button className="btn btn-info btn-sm" onClick={() => anneePrecedente()}><i className="bi bi-caret-left-fill"></i>Année précédente</button>
                </div>
                {CAdate < dateday.toLocaleDateString('fr-FR', {year: 'numeric'}) &&
                  <div className="col-6">
                    <button className="btn btn-info btn-sm" onClick={() => anneeSuivante()}>Année suivante<i className="bi bi-caret-right-fill"></i></button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>


        <div className="row mt-3">
          <div className="card border-info mb-3" style={{maxWidth: "24rem"}}>
            <div className="card-header"><b className="">Trimestre</b></div>
            <div className="card-body">
              <p className="card-text">Periode: </p>
              <p className="card-text">CA Payé: </p>
              <p className="card-text">CA Estimé: </p>
              <p className="card-text">Taux de charge: {user.taux_charge}%</p>
              <p className="card-text">Charges estimées à payer:</p>
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-6">
                  <button className="btn btn-info btn-sm"><i className="bi bi-caret-left-fill"></i>Année précédente</button>
                </div>
                <div className="col-6">
                  <button className="btn btn-info btn-sm">Année suivante<i className="bi bi-caret-right-fill"></i></button>
                </div>
              </div>
            </div>
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
