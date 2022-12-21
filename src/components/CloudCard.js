import React, { Children, useEffect } from 'react'
import { useLayoutEffect, useRef, useState } from 'react';

import { Card } from 'antd'

function CloudCard({ title, tabs, tabsContent, overflowY = 'visible', width = '100%', minHeight, maxHeight, height = 'auto', children }) {
    const ref = useRef(null);
    const [tabKey, setTabKey] = useState();

    useEffect(() => {
        // if (!tabs && title) {
        //     tabs = [{ key: title, tab: title }]
        // } else {
        //     tabs = tabs.map(t => ({ key: t, tab: t }))
        // }
        if (tabs && tabs.length > 0) {
            console.log('tabs changed')
            setTabKey(tabs[0].key)
        }
    }, [tabs?.length])

    return (
        <Card ref={ref}
            className='cloud-card'
            style={{
                width,
            }}
            title={title}
            activeTabKey={tabKey}
            onTabChange={key => {
                console.log('onTabChange', key)
                setTabKey(key)
            }}
            tabList={tabs}
        >
            <div style={{
                height,
                minHeight,
                maxHeight,
                overflowY,
            }}>
                {children}
                {tabsContent && tabsContent[tabKey]}
            </div>
        </Card>

    )
}

CloudCard.propTypes = {}

export default CloudCard
