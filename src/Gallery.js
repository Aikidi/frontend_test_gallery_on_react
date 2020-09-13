import React, { useState } from 'react';
import OneImg from './OneImg';
import { loadElmFromFile } from './FileFunction';

const Gallery = props => {
  const [showBig, setShowBig] = useState({
                                            stateShow: false, 
                                            idShow: 0, 
                                            urlShow: ''
                                        });
 
  const openBigImg = imgIndex => {
    setShowBig({
      stateShow: true, 
      idShow: imgIndex, 
      urlShow: props.galleryArr[imgIndex].src
    });
  }

  const handleDragover = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }

  const handleDrop = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    let promiseAllFileLoad = [];
    let elmFromDragDrop = [];
    let startNum = Number(props.galleryArr.length)+1;
    for (let oneFileElm of evt.dataTransfer.files) {
        promiseAllFileLoad.push(
        loadElmFromFile(URL.createObjectURL(oneFileElm), startNum).then(
          imgElm =>  {  
            elmFromDragDrop = elmFromDragDrop.concat(imgElm);
            startNum = startNum + imgElm.length;  
        })
        );
    }
    Promise.allSettled(promiseAllFileLoad).then( () => {
      props.addElmentsImg(elmFromDragDrop);
    });
  }

  let bigImgWidth  = props.windowSize.infoWidth*0.8;
  let bigImgHeight = bigImgWidth/props.galleryArr[showBig.idShow].naturalWidth*props.galleryArr[showBig.idShow].naturalHeight;
  bigImgHeight = bigImgHeight > props.windowSize.infoHeight*0.65 ? props.windowSize.infoHeight*0.65 : bigImgHeight;
  bigImgWidth  = bigImgHeight/props.galleryArr[showBig.idShow].naturalHeight*props.galleryArr[showBig.idShow].naturalWidth;
  const divstyle = {
    "height": props.windowSize.infoHeight*0.65,
    "width": props.windowSize.infoWidth
  };

  return (
      <main className="page-main" onDragOver={ evt => { handleDragover(evt); } } onDrop={ evt => { handleDrop(evt); } } >  
      <div className="page-wrapper">
        <ul className="gallery-list list-unstyled"> 
          {props.galleryArr.map(
            (item, index) => 
            <OneImg 
                item={item} 
                index={index} 
                inputFileClick={props.inputFileClick} 
                openBigImg = { imgIndex => { openBigImg(imgIndex); } } 
                deleteOneImg={ delIndex => { props.deleteOneImg(delIndex); } } 
                key={index}
            />
          )}
        </ul>

      { showBig.stateShow ? (
        <div className="big-img" style={divstyle}>
          <img 
            alt="BigShow" 
            className="gallery-list__img" 
            height={bigImgHeight-40}
            width={bigImgWidth-40}
            src={showBig.urlShow} 
          />
          {showBig.idShow!==1 ? <button className="big-img__button big-img__button--prev" onClick={ () => openBigImg(showBig.idShow-1) }></button> : null}
          <button className="big-img__button big-img__button--close" value="close" onClick={ () => setShowBig({stateShow: false, idShow: 0, urlShow: ''}) }></button>
          {showBig.idShow!==props.galleryArr.length-1 ? <button className="big-img__button big-img__button--next" onClick={ () => { openBigImg(showBig.idShow+1); } }></button> : null}
        </div> )
        : null }
      </div>      

    </main>
  );

}

export default Gallery;