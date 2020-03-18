import { useEffect, useState } from 'react'

import SockJS from 'sockjs-client'

export default function usePrinterSocket(printer){
  const [printerStatus, setPrinterStatus] = useState()

  useEffect(() => {
    if(!printer) return 

    const sock = new SockJS(`http://${printer.ip}/sockjs`)

    sock.onopen = () => {
      console.log('Connection Success')
    }
  
    sock.onmessage = (e) => {
      if (e.data.current && e.data.current.temps.length > 0){
        setPrinterStatus(e.data.current)
      }
    }

    sock.onclose = () => {
      console.log('Switching Printer')
    }

    return () => {
      sock.close()
    }
  }, [printer])

  return printerStatus
}