const rowCorrectResize = (rowListImges, rowCurrWidth, difWidth, screenWidth) => {
  return new Promise(function(resolve, reject) {
    let newRowImages = rowListImges.slice();
    let lfirstImgWidth = (Math.round(difWidth*(rowListImges[0].width/rowCurrWidth)) - 1) + rowListImges[0].width;
    let firstRowImgHeight = (lfirstImgWidth / rowListImges[0].naturalWidth) * rowListImges[0].naturalHeight;
    let RowRealWidth = 0;
    for (var i = 0; i <= rowListImges.length-1; i++) {       
      let elmImgWidth = 0;
          let resultPx = Math.round((Math.round(difWidth*(rowListImges[i].width / rowCurrWidth))-1)+rowListImges[i].width);
          elmImgWidth = (i === (rowListImges.length-1) ) ? screenWidth - RowRealWidth -2 : resultPx;
          RowRealWidth = RowRealWidth + elmImgWidth + 2;    
          newRowImages[i].width = elmImgWidth;    
          newRowImages[i].height = firstRowImgHeight; 
    } 
    resolve(newRowImages);
  });         
}

export const resizeImage = (galleryListImges, screenWidth = document.documentElement.clientWidth, initRowHeight = 150 ) => {
  return new Promise(function(resolve, reject) {
      screenWidth = screenWidth > 860 ? 860 : (screenWidth < 320 ? 320 : screenWidth);
      let numLastInRow = 0;
      let rowCurrWidth = 0;
      let imgAvgWidthInRow = 0;
      let difWidth = 0;
      let imgCount = 0;
      let lastInRow = false;
      let promiseAllResize = [];
      let newArray = [];
      let collectRowBeforeArr = [];
      let galleryRowImges = [];

      for (let Img of galleryListImges) {
        if (lastInRow) {  
          difWidth = screenWidth; 
          lastInRow = false;  
        } else {  
          let listImgWidth = (initRowHeight / Img.naturalHeight) * Img.naturalWidth;
          Img.width = listImgWidth;                
          Img.height = initRowHeight;
          rowCurrWidth = rowCurrWidth + listImgWidth;           
          difWidth = screenWidth - rowCurrWidth;              
        }

        imgCount = imgCount +1; 
        imgAvgWidthInRow = rowCurrWidth / (imgCount-numLastInRow);
        if (difWidth <= imgAvgWidthInRow || galleryListImges.length === imgCount)  { 
          let lastElement = imgCount - 1;       
          let nextImgWidth = 0;                 
          if (galleryListImges.length !== imgCount) {         
            nextImgWidth = (initRowHeight / galleryListImges[imgCount].naturalHeight) * galleryListImges[imgCount].naturalWidth;
            galleryListImges[imgCount].width = nextImgWidth;          
            galleryListImges[imgCount].height = initRowHeight;
          } 

          if ( (nextImgWidth < difWidth * 1.2) && (nextImgWidth > difWidth) ) {                
            lastElement = imgCount;
            rowCurrWidth = rowCurrWidth + nextImgWidth;              
            difWidth = difWidth - nextImgWidth;                  
            lastInRow = true;                           
          }

          if ( (difWidth > screenWidth/2 && screenWidth > 480) && galleryListImges.length === imgCount ) {
            lastElement = imgCount;
            screenWidth = screenWidth/2;
            difWidth = difWidth - screenWidth;
          }
            
          collectRowBeforeArr.push({
                                  row: galleryListImges.slice(numLastInRow, lastElement+1), 
                                  rowCurrWidth: rowCurrWidth, 
                                  difWidth: difWidth, 
                                  screenWidth: screenWidth
                                });

          rowCurrWidth = 0;
          numLastInRow = lastElement + 1;
        } 
      }

    for (let oneRowBefore of collectRowBeforeArr) {
      promiseAllResize.push(
        rowCorrectResize(oneRowBefore.row, oneRowBefore.rowCurrWidth, oneRowBefore.difWidth, oneRowBefore.screenWidth).then( resizedRow => {
            galleryRowImges.push(resizedRow);
          })
      );
    }

    Promise.allSettled(promiseAllResize).then( () => {
      for (let oneRowNum of galleryRowImges) {
        newArray = newArray.concat(oneRowNum);
      }
      resolve(newArray);
    }); 

  })
}