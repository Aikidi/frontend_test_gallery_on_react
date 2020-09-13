import React, { useState } from 'react';
import { loadElmFromFile } from './FileFunction';

const UploadForm = props => {
  const [fileUrl, setFileUrl] = useState('');

  const handleSubmit = evt => {    
    evt.preventDefault(); 
    loadElmFromFile(fileUrl, Number(props.imageCount)+1).then(
      imgElm => { props.addElmentsImg(imgElm); }
    );
    setFileUrl('');
  }

  return (
    <form action="" className="upload-form" onSubmit={(evt) => handleSubmit(evt)}>
        <input 
          ref={props.getFileInputRef}
          type="file" 
          className="upload-form__link" 
          name="localfile" 
          accept="image/*, application/json" 
          onChange={ evt => { setFileUrl(URL.createObjectURL(evt.target.files[0])); } }
        />
        <input 
          type="text" 
          className="upload-form__field" 
          placeholder="Кликните дважды для выбора файла или введите url"
          value={fileUrl} 
          onChange={ evt => { setFileUrl(evt.target.value); } } 
          onDoubleClick={() => props.inputFileClick()}
        />
        <button className="upload-form__button" type="submit" >Загрузить</button>
    </form> 
  )
}
export default UploadForm;