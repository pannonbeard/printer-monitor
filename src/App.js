import React, { useState, useEffect } from 'react';
import './App.css';

import Form from './component/Form'
import PrinterFiles from './component/PrinterFiles/PrinterFiles'

import usePrinterSocket from './hooks/usePrinterSocket'

const { ipcRenderer } = window.electron

function App() {
  // ipcRenderer.send('something-sent', { hi: 'hello-world' })
  const [registering, setRegistering] = useState(false)
  const [printers, setPrinters] = useState([])
  const [currentPrinter, setCurrentPrinter] = useState(null)
  const printerStatus = usePrinterSocket(currentPrinter)

  useEffect(() => {
    const registeredPrinters = ipcRenderer.sendSync('get-printers', {})
    console.log(registeredPrinters)
    setPrinters(registeredPrinters)
    setCurrentPrinter(registeredPrinters[0])
  }, [])

  const startRegistration = () => {
    setRegistering(true)
  }

  const register = (printerInfo) => {
    setCurrentPrinter(printerInfo)
    setRegistering(false)
    ipcRenderer.send('add-printer', printerInfo)
  }

  const selectPrinter = (ip) => {
    const printer = printers.find(print => print.ip === ip)
    setCurrentPrinter(printer)
  }

  return (
    <div className="App">
      <nav>
        <select onChange={(e) => selectPrinter(e.target.value)}>
          <option>Select from Available Printers</option>
          { printers.map( printer => 
            <option key={printer.ip} value={printer.ip}>{printer.name}</option>) 
          }
        </select>
        <button onClick={startRegistration}>Register 3d Printer</button>
      </nav>
      { registering && <Form register={register}/> }
      { currentPrinter && <>
        <header>
          { currentPrinter.name }
          { printerStatus && <span>{printerStatus.state.text}</span> }
        </header>
        
        { printerStatus && <div className='temps'>
          <div className='hot-end'>
            Hot End Temp: {printerStatus.temps[0].tool0.actual}C
          </div>
          { printerStatus.temps[0].bed.actual && <div className='bed'>
            Bed Temp: {printerStatus.temps[0].bed.actual}C
          </div> }
        </div>}
        <PrinterFiles printer={currentPrinter}/>
      </> }
      
    </div>
  );
}

export default App;
