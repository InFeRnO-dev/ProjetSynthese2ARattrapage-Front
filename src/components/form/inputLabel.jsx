import React from 'react'

export default function InputLabel({type, label, placeholder, value, change, name, id, className, required}) {
    return (
        <div className="form-row">
            <div className="col-lg-7">
            <label htmlFor={name}>{label}</label>
            <input onChange={change} value={value} name={name} type={type} className={className} id={id} placeholder={placeholder} required={required}/>
            </div>
        </div>
    )
}
