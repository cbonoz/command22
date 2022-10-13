import React, { Children } from 'react'
import {useLayoutEffect, useRef, useState} from 'react';

import { Card } from 'antd'

function CloudCard({title, width=300, minHeight, height='auto', children}) {
    const ref = useRef(null);

  return (
        <Card ref={ref}
            className='cloud-card'
            style={{
                width,
            }}
            title={title?.toUpperCase()}
            >
            <div    style={{
                height,
                minHeight
            }}>
            {children}
            </div>
        </Card>

  )
}

CloudCard.propTypes = {}

export default CloudCard
