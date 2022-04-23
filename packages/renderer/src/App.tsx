import styles from '@/styles/app.module.scss'
import { useState } from 'react'

const App = () => {
  const [fileManagerOpen, setFileManagerOpen] = useState(false)
  const [fileExists, setFileExists] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [isHideButtons, setIsHideButtons] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [messageColor, setMessageColor] = useState('')
  const [editorContent, setEditorContent] = useState('')  

  const searchFile = () => {
    if (fileName) {
      setFileExists(window.fs.existsSync(`filesDir/${fileName}`))
      window.fs.existsSync(`filesDir/${fileName}`) ? updateStatus('File exist! Choose what you want to do with it.', 'green')
      : updateStatus('File doesn\'t exist! create the file if needed.', 'red')
      } else {
        updateStatus('Please enter a file name', 'red')
      }
  }

  const createFile = () => {
    window.fs.writeFile(`filesDir/${fileName}`, "", (err) => {
      setFileExists(!err)
      updateStatus('File created! Choose what you want to do with it.', 'green')
    })
  }

  const readFile = () => {
    if (fileName) {
    window.fs.readFile(`filesDir/${fileName}`, 'utf8', function(err, data) {
      err ? updateStatus(`Failed to read file for reason : ${err} `, 'red')
      : updateStatus(`File content: ${data} `, 'white')
    })
    } else {
      updateStatus('Please enter a file name', 'red')
    }
  }

  const editFile = () => {
    readFile()
    setIsEdit(true)
    setIsHideButtons(true)
  }

  const deleteFile = () => {
    window.fs.unlink(`filesDir/${fileName}`, (err) => {
      if(!err) {
        updateStatus('File successfully deleted!', 'green')
      } else {
        updateStatus(`File deletion failed for reason : ${err} `, 'red')
      }})
      setFileExists(null)
  }

  const handleEdit = (editType) => {
    if (editType === 'append') {
      window.fs.appendFile(`filesDir/${fileName}`, editorContent, (err) => {
        updateStatus('File content appended! Choose what you want to do with it.', 'green')
      })
    }
    if (editType === 'replace') {
      window.fs.writeFile(`filesDir/${fileName}`, editorContent, (err) => {
        updateStatus('File content replaced! Choose what you want to do with it.', 'green')
      })
    }
    setIsEdit(false)
    setIsHideButtons(false)
  }

  const updateStatus = (message, color) => {
    setStatusMessage(message)
    setMessageColor(color)
  }

  const renderStatusMessage = () => <h5 style={{color: messageColor}}>{statusMessage}</h5>

  const renderButtons = () => !fileExists ? <input type="button" onClick={createFile} value="Create File"/>
    :<div>
      <input type="button" onClick={readFile} value="Read"/>
      <input type="button" onClick={editFile} value="Edit"/>
      <input type="button" onClick={deleteFile} value="Delete"/>
    </div>

const renderEditor = () => <>
      <textarea id="txtid" name="txtname" rows="4"
        cols="50" maxlength="200" onChange={(e)=>setEditorContent(e.target.value)} />
      <div>
      <input type="button" id="append" onClick={(e)=> handleEdit(e.target.id)} value="Append content"/>
      <input type="button" id="replace" onClick={(e)=> handleEdit(e.target.id)} value="Replace content"/>
    </div>
    
    </>
  
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        {!fileManagerOpen ? 
        <><h1>File editor app</h1>
        <h4>This app allows you to do CRUD on a local dierctory in your projects root directory.</h4>
        <button
          style={{backgroundColor:'#08b9f1a1'}}
          type="button"
          onClick={()=>{setFileManagerOpen(true)}}>
            Get Started
        </button></> 
        : <>
          <input type="text" onChange={(e)=>{setFileName(e.target.value)}} readOnly={isEdit} />
          {!isEdit && <input type="button" onClick={searchFile} value="Search"/>}
          {renderStatusMessage()}        
          {isEdit && renderEditor()}
          {(fileExists !== null && !isHideButtons) && renderButtons()}        
        </>}
      </header>
    </div>
  )
}

export default App
