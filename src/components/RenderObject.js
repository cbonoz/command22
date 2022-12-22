import React from 'react'
import { capitalize } from '../util';

export default function RenderObject({ title, obj, className, style }) {
    if (!obj) {
        return null;
    }
    return (
        <span className={className} style={style}>
            {title && <h3 >{title.toUpperCase()}</h3>}
            {obj && Object.keys(obj).map((k, i) => {
                const val = obj[k]
                if (Array.isArray(val)) {
                    return <span className='render-object-key' key={i}>{capitalize(k)}: <b>{val.join(', ')}</b></span>
                } else if (typeof val === 'object') {
                    return <RenderObject key={i} obj={val} className={className} />
                }
                return <span className='render-object-key' key={i}>{capitalize(k)}: <b>{val}</b></span>
            })}
        </span>
    )
}
