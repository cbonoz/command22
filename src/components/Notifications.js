import { Button, Dropdown, Modal, Table, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useEffect, useState } from 'react'
import { getItemsWithOrgDomainFilter } from '../firebase/firedb'
import { capitalize, getDomainFromEmail } from '../util'
import { NOTIFICATION_COLUMNS } from '../util'
import CloudCard from './CloudCard'

const {Option} = Select


const TYPE_OPTIONS = [
  'info', 'warning', 'alert'
]

export default function Notifications({user}) {
  const [notifications, setNotifications] = useState([])
  const [text, setText] = useState()
  const [type, setType] = useState(TYPE_OPTIONS[0])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const domain = getDomainFromEmail(user.email)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await getItemsWithOrgDomainFilter('notifications', domain)
      setNotifications(res.data)
      console.log('notifs', res.data)
    } catch (e) {
      console.error('err', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const submit = async () => {
    const notification = {
      type,
      text,
      createdAt: new Date(),
      createdBy: user.email
    }
    // TODO: call to firebase db.
    setNotifications([...notifications, notification])
    setShow(false)
  }

  return (
    <div>
        <CloudCard minHeight={500} title={`Team Notifications (Domain: ${getDomainFromEmail(user.email)})`} width={'50%'}>
        <Table
          columns={NOTIFICATION_COLUMNS}
          dataSource={notifications}
          locale={{emptyText:"You're up to date!"}}
          loading={loading}
        />

        <a href="#" onClick={(e) => {
          e.preventDefault()
          setShow(true)
        }}>Add new notification</a>
</CloudCard>

<Modal visible={show} okText="Submit" onOk={() => submit()} onCancel={() => setShow(false)} title="Add notification">
    <p>Enter detail for notification</p>

    <Select value={type} onChange={v => setType(v)}>
      {TYPE_OPTIONS.map((o, i) => {
        return <Option key={i} value={o}>{capitalize(o)}</Option>
      })}
    </Select>

    <TextArea
      rows={5}
      value={text}
      onChange={e => setText(e.target.value)}/>
  {/* <Button type='primary' onClick={submit} disabled={loading || !text}>Submit</Button> */}
</Modal>
    </div>
  )
}
