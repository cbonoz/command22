import React, { Children } from 'react'
import {useLayoutEffect, useRef, useState} from 'react';

import { Card } from 'antd'

function CloudCard({title, width, height, children}) {
    const ref = useRef(null);

  return (
        <Card ref={ref}
            className='cloud-card'
            style={{
                width,
                height
            }}
            title={title}
            >
            {children}
        </Card>

  )
}

CloudCard.propTypes = {}

export default CloudCard
