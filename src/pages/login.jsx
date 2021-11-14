import React, { useState } from 'react'
import { useHistory } from 'react-router'
import InputLabel from '../components/form/inputLabel'
import { getTokenByEmail } from '../services/api/admin/userapi'
import {formHandleChange} from '../services/formService'
import { setInStore, TOKEN_KEY } from '../services/store'
import styles from '../style/login.module.css'

export default function Login() {
    const [login, setlogin] = useState({email: '', pwd: ''})
    const [error, seterror] = useState(false)
    const history = useHistory()

    const handleChange = (event) => {
        formHandleChange(event, login, setlogin)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(login.email, login.pwd)
        const token = await getTokenByEmail(login.email, login.pwd)
        console.log(token)
        if(token !== "" && token !== undefined){
            setInStore(TOKEN_KEY, token.data.token)
            history.push("/")
        }
        else {
            seterror(true)
        }
    }
    return (
        
        <section className={`Form ${styles.section}`}>
            <div className="container">
                <div className={`row g-0 ${styles.row}`}>
                    <div className="col-lg-5">
                        <img className={`img-fluid ${styles.img}`} src="https://bubbleplan.net/blog/wp-content/uploads/2018/02/174881-OWGUQQ-663-01.jpg" alt=""/>
                    </div>
                    <div className={`col-lg-7 ${styles.form}`}>
                        <form onSubmit={handleSubmit}>
                            <h1>Connexion</h1>
                            {
                                error && (
                                    <div className="alert alert-dismissible alert-danger ">
                                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                                        <strong>Erreur</strong> <a href="#" className="alert-link">Email ou mot de passe incorrect !</a>
                                    </div>
                                )
                            }
                            <InputLabel name="email" className="form-control my-3 p-2" value={login.email} change={handleChange} type="Email" label="Email" placeholder="mr.dupont@ping-pong.fr" required="true"/>
                            <InputLabel name="pwd" className="form-control my-3 p-2" value={login.pwd} change={handleChange} type="password" label="Mot de passe" placeholder="********" required="true"/>
                            <div className="form-row">
                                <div className="col-lg-7">
                                    <button type="submit" className="btn btn-primary mt-3 w-100">Connexion</button>
                                </div>
                            </div>
                            <p className="mt-3">Nouvel Utilisateur ? <a href="/register">Créer un compte</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}