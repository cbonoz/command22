import React, { Children } from 'react'
import {useLayoutEffect, useRef, useState} from 'react';

import { Card } from 'antd'

function CloudCard({title, overflowY='visible', width='auto', minHeight, height='auto', children}) {
    const ref = useRef(null);

  return (
        <Card ref={ref}
            className='cloud-card'
            style={{
                width,
            }}
            title={title}
            >
            <div    style={{
                height,
                minHeight,
                overflowY,
            }}>
            {children}
            </div>
        </Card>

  )
}

CloudCard.propTypes = {}

export default CloudCard
