import React, {useEffect, useState} from 'react'

import './Files.css'

export default function PrinterFiles({printer}){
  const [files, setFiles] = useState([])

  useEffect(() => {
    console.log('Files Loading')
    const headers = {
      'X-Api-Key': printer.printerKey
    } 

    fetch(`http://${printer.ip}/api/files`, {
      headers
    })
      .then(data => data.json())
      .then(json => setFiles(json.files))
      .catch(console.error)
  }, [printer])

  return(
  <div className='Files'>
    <h2>Files</h2>
    <div className='FileUpload'>
      <label htmlFor='new-file-upload'>Upload File</label>
      <input type='file' id='new-file-upload' />
    </div>
    <div>
      {files.map(file => (
        <div key={file.name} className='File'>
          {file.name}
          <div className='file-info-actions'>
            <span>Size: {file.size}</span>
            <div>
              <button>Print</button>
              <button>Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}