import React from 'react'

const UrlCard = (props) => {
  return (
    <>
                <div className="url_card">
                <h4>{props.header}</h4>
                <p>URL:{props.url}</p>
                <h6>{props.title}</h6>
                <p>{props.api}</p>
            </div>
      
    </>
  )
}

export default UrlCard
