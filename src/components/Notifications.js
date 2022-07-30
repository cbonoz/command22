import { Table } from 'antd'
import React from 'react'
import CloudCard from './CloudCard'

export default function Notifications() {
  return (
    <div>
        <CloudCard title="Notifications" width="90%">
        <Table
        locale={{emptyText:"You're up to date!"}}
        />
</CloudCard>
    </div>
  )
}
