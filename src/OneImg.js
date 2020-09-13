import React from 'react';

const OneImg  = props => {

  return ( 
    <li className="gallery-list__item" key={props.item.id}>
      { props.item.onClickOpen ?
        <img alt="gallery item" className="gallery-list__img" 
          width={props.item.width} 
          height={props.item.height} 
          src={props.item.src} 
          key={props.index} 
          onClick= { () => { props.openBigImg(props.index); } }
        /> 
        :
        <img alt="gallery item" className="gallery-list__img" 
          width={props.item.width} 
          height={props.item.height} 
          src={props.item.src} 
          key={props.index} 
          onClick= { () => { props.inputFileClick() } } 
        />
      }
      { props.item.delButton ? 
        <button className="gallery-list__del-button" onClick={ () => { props.deleteOneImg(props.index); } }/> : null 
      }
    </li>
  ) 
}

export default OneImg;