export const isImg = (urlForCreateElm, indexForElm) => {
  return new Promise( (resolve, reject) => {
      let img = new Image()
      img.onload = () => {
        let elemToPush = {
          id: Number(indexForElm), 
          src: urlForCreateElm, 
          width: 150/img.naturalHeight*img.naturalWidth, 
          height: 150, 
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight, 
          delButton: true, 
          onClickOpen: true 
        }
        resolve(elemToPush);
      }
      img.onerror = () => {
        reject(urlForCreateElm);
      }
      img.src = urlForCreateElm;
  })
}

export const readElmFromJson = (fileUrl, startItem) => {   
  return new Promise( (resolve, reject) => {  
    fetch(fileUrl, { method:'GET', headers: { 'Content-Type': 'text/plain' } }).then( 
      response => { return response.json(); },
      errLoad  => { reject (errLoad);       }
    ).then( data => { 
          createElmArrFromUrlArr(data.galleryImages, startItem).then( resultElm => { resolve(resultElm); });
      });
  });
};

export const createElmArrFromUrlArr = (toDoItems, startItem) => {
  return new Promise( (resolve, reject) => {  
    const addArrayItems = []; 
    const promiseAllImg = [];
    for (let oneItem in toDoItems) {
      promiseAllImg.push(
        isImg(toDoItems[oneItem].url, Number(startItem)+Number(oneItem)).then( resultElm => {
          addArrayItems.push(resultElm);
        })
      );
    }
    Promise.allSettled(promiseAllImg).then( () => {
      resolve(addArrayItems.sort( (a,b) => a.id-b.id )) ;
    });
  })
}

export const loadElmFromFile = (testURL, startItem) => {
  return new Promise( (resolve, reject) => {
    isImg(testURL, startItem).then(
      resultElm => { return {res: true, data: [resultElm]}; },
      notImgURL => { return {res: false, data: notImgURL};  }
    ).then( typeData => { 
          resolve(typeData.res ? typeData.data : readElmFromJson(typeData.data, startItem).then( dataParsedFromJSON => { return dataParsedFromJSON; } ));
      });
  })
}