import React from 'react';
import '../css/wb_login_details.css';
import Export from '../Assets/images/export.png';

const WbLoginDetails = () => {
  return (
    <>


<div className="Sender_id_contian">
    <h4 className="Head_title">Login Details
            <button className="add_btn"><img src={Export} alt="img"/> Export</button>
        </h4>
    <div className="Sender_id_Card">
        <div className="table_contain">
            <table className="Table" id="Table">
                <thead>
                    
                    <tr>
                        <th>S_No.</th>
                        <th>User ID</th>
                        <th>Ip Address</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody id="">
                    <tr>
                        <td>1</td>
                        <td>user</td>
                        <td>010.202.303</td>
                        <td>05-08-2024</td>
                        <td>14:56:28</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

      
    </>
  )
}

export default WbLoginDetails
