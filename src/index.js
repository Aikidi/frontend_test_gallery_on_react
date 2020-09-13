import React , { useState } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import UploadForm from './UploadForm';
import Gallery from './Gallery';
import { resizeImage } from './ResizeFunction';

import './index.css';

const App = () => {
  const [imageCount, setImageCount] = useState(1);
  const [galleryArr, setGalleryArr] = useState( [{ 
                                                    id: 1, 
                                                    src: require('./img/upload.jpg'), 
                                                    width: 150/294*322, 
                                                    height: 150, 
                                                    naturalWidth: 322, 
                                                    naturalHeight: 294, 
                                                    delButton: false, 
                                                    onClickOpen: false
                                                  }]);
  useEffect( () => {
    if (imageCount !== galleryArr.length) {
      setImageCount(galleryArr.length);
    }
  }, [galleryArr, imageCount]);

  const [windowSize, setWindowSize] = useState({infoWidth: (document.documentElement.clientWidth > 860 ? 860 : (document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth)), infoHeight: document.documentElement.clientHeight })
  useEffect(() => {
    const handlerResize = () => {
      setWindowSize({infoWidth: (document.documentElement.clientWidth > 860 ? 860 : (document.documentElement.clientWidth < 320 ? 320 : document.documentElement.clientWidth)), infoHeight: document.documentElement.clientHeight });
      resizeImage(galleryArr).then( (resultArr) => {setGalleryArr(resultArr);} );
      return windowSize;
    }
    window.addEventListener('resize', handlerResize);
    return () => { window.removeEventListener('resize', handlerResize); }
  }, [galleryArr, windowSize]);

  const addElmentsImg = newElmentsArray => {
    let newGalleryArr =  galleryArr.concat(newElmentsArray);
    resizeImage(newGalleryArr).then(resizeArr => {setGalleryArr(resizeArr);} );
  }

  const deleteOneImg = delIndex => {
    let deletedGalleryArr = galleryArr.filter((_, index) => index !== delIndex);
    resizeImage(deletedGalleryArr).then(resizeArr => {setGalleryArr(resizeArr);} );
  }

  const getFileInputRef = React.useRef(null)
  const inputFileClick = () => {
      getFileInputRef.current.click();
  }

  return(
    <div className="App">
      <header className="page-header">
        <div className="page-wrapper"> 
          <UploadForm  
            imageCount={imageCount} 
            addElmentsImg={addElmentsImg} 
            inputFileClick={inputFileClick} 
            getFileInputRef={getFileInputRef}
            />
        </div>
       </header> 
      <Gallery     
        galleryArr={galleryArr}
        addElmentsImg={addElmentsImg}
        deleteOneImg={deleteOneImg} 
        inputFileClick={inputFileClick}  
        getFileInputRef={getFileInputRef}
        windowSize={windowSize}
        /> 
      <footer className="page-footer"></footer>  
    </div>
  )
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);