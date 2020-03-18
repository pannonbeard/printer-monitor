import React, { useState } from 'react'

export default function Form ({ register }) {
  const [ip, setIp] = useState('')
  const [name, setName] = useState('')
  const [printerKey, setPrinterKey] = useState(null)
  const [requesting, setRequesting] = useState(false)

  const requestKey = async () => {
    setRequesting(true)
    const response = await fetch(`http://${ip}/plugin/appkeys/request`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ app: 'MyLocalLookup' })
    })

    const data = await response.json()

    if (data.app_token){
      let decision = { ok: false, status: 0 }
      while (decision.status !== 200){
        decision = await fetch(`http://${ip}/plugin/appkeys/request/${data.app_token}`)
      }
      if (decision.status === 200){
        const keysResponse = await fetch(`http://${ip}/api/plugin/appkeys`)
        const { keys } = await keysResponse.json()
        const myAppKey = keys.find(key => key.app_id === 'MyLocalLookup')
        setPrinterKey(myAppKey.api_key)
        setRequesting(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    register({
      ip,
      name,
      printerKey
    })
  }

  return(
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='printer_ip'>Printer IP</label>
        <input name='ip' id='printer_ip' value={ip} onChange={(e) => setIp(e.target.value)} />
      </div>
      <div>
        <label htmlFor='printer_name'>Printer Name</label>
        <input name='name' id='printer_name' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      { printerKey && <div>Key: {printerKey} </div> }
      { !printerKey && ip && <button type='button' disabled={requesting} onClick={requestKey}>{requesting ? 'Requesting' : 'Request Key'}</button> }
      { printerKey && <button type='submit'>Register</button> }
    </form>
  )
}