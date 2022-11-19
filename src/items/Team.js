import React, { useContext } from "react";
// import React, { useState, useEffect } from "react";
import UserContext from "../auth/userContext";
import FavoriteHandler from "./FavoriteHandler";
import Heading from "./Heading";
import "./Team.css";

const Team = ({
  id,
  name, 
  logo, 
  country, 
  flag, 
  founded, 
  venue, 
  city, 
  capacity, 
  image
}) => {
  console.log("Team  >>  props");
  console.log(id);

  const { favoriteTeams } = useContext(UserContext);

  return (
    <div className="Team d-flex justify-content-center">

      <div className="Team-container mt-5 mx-5">

        <FavoriteHandler 
          id={+id} 
          type="team" 
          favsArr={favoriteTeams} 
        />

        <Heading 
          header={"Team Info"}
          logo={logo}
          name={name}
          country={country}
          flag={flag}
        />

        <div className="row mt-3">
          <div className="ml-4 col d-flex align-items-start flex-column">
            <p className="my-2">
              <span className="font-weight-bold fontsize_1_3_rem">
                Founded: 
              </span> 
               {" " + founded}
            </p>

            <p className="my-2">
              <span className="font-weight-bold fontsize_1_3_rem">
                Venue: 
              </span> 
               {" " + venue}
            </p>

            <p className="my-2">
              <span className="font-weight-bold fontsize_1_3_rem">
                City: 
              </span> 
               {" " + city}
            </p>

            <p className="my-2">
              <span className="font-weight-bold fontsize_1_3_rem">
                Capacity: 
              </span> 
               {" " + capacity}
            </p>
          </div>

          <div className="mr-4 col d-flex align-items-center justify-content-end">
            <img className="rounded" src={image} alt="" />
          </div>
        </div>
      </div>

    </div>
  )
};

export default Team;