import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./HomeLoggedIn.css";
import UserContext from "../auth/userContext";
import { defaultSeason } from "../config";

/** Homepage of site. 
 * 
 * Shows welcome message or login/register buttons. 
 * 
 * Routed at / 
 * 
 * Routes -> Homepage
 */

function Favorites({ favoriteArr, type }) {
  const { unfavorite } = useContext(UserContext);
  
  return (
    <div className="mt-4">
      {
        favoriteArr.length
          ? 
        <h3>{`Favorite ${type.charAt(0).toUpperCase() + type.slice(1)}s`}</h3>
          : 
        <></>
      }
      <div className="Favorite row justify-content-center">
        <ul className="list-group col-sm-10 col-md-8 col-lg-6 col-xl-5">
          {favoriteArr.map(
            item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span className="">
                  <Link to={{ pathname: `/${type}/${item.id}` + type === `team` ? `` : `/${defaultSeason}` }}>
                    <div className="small-logo d-inline mr-3">
                      <img src={item.logoUrl} alt="item-logo" />
                    </div>
                    <span className="">
                      <h5 className="d-inline mr-2">{item.name}</h5>
                    </span>
                  </Link>
                    - {item.country}

                  <div className="small-flag d-inline ml-3">
                    <img src={item.flagUrl} alt="item-flag" />
                  </div>
                </span>

                <button 
                    className="badge badge-danger" 
                    onClick={(() => unfavorite(type, item.id))}>X</button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default Favorites;
