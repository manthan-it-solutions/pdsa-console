import React from 'react'

const TodayCard = (props) => {
  return (
    <>

<div className={`Today_card ${props.cardClass}`}>
                <div className="Today_card_img_contain">
                    <div className={props.className}><img src={props.src} alt="img"/></div>
                    <span>: {props.data}</span>
                </div>
                <div><h4 >{props.header}</h4></div>
            </div>

    </>
  )
}

export default TodayCard
