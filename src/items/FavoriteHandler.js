import React, { useContext } from "react";
import UserContext from "../auth/userContext";

/** FavoriteHandler Component
 */

function FavoriteHandler({ id, type, favsArr }) {
  const { favorite, unfavorite } = useContext(UserContext);
  
  return (
      <div className="FavoriteHandler mt-5">
        {favsArr.filter(c => c.id === +id).length === 1
          ?
          <div className="d-flex justify-content-center">
            <h4 className="mr-3">{`One of your favorite ${type}s`}</h4> 
            <button type="button" 
                    className="btn btn-outline-danger" 
                    onClick={(() => unfavorite(type, +id))}>REMOVE</button>
          </div>
          : 
          <div className="d-flex justify-content-center">
            <h4 className="mr-3">{`Not a favorite ${type} of yours`}</h4> 
            <button type="button" 
                    className="btn btn-success"
                    onClick={(() => favorite(type, +id))}>ADD</button>
          </div>
        }
      </div>
  );
}

export default FavoriteHandler;
