import React, { Children } from 'react'
import {useLayoutEffect, useRef, useState} from 'react';

import { Card } from 'antd'

function CloudCard({title, width=300, height=300, children}) {
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
                height
            }}>
            {children}
</div>
        </Card>

  )
}

CloudCard.propTypes = {}

export default CloudCard
