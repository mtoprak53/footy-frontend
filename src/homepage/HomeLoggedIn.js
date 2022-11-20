import React, { useContext } from "react";
import Favorites from "./Favorites";
import "./HomeLoggedIn.css";
import UserContext from "../auth/userContext";

/** Homepage of site. 
 * 
 * Shows welcome message and favorite stuff. 
 * 
 * Routed at / 
 * 
 * Routes -> Homepage
 */

function HomeLoggedIn({ user }) {
  const { favoriteLeagues, favoriteCups, favoriteTeams } = useContext(UserContext);

  return (
      <div className="HomeLoggedIn">
        <h2>Welcome {user.username}</h2>

        <div className="Favorites-Container mt-5">

          <Favorites 
            favoriteArr={favoriteLeagues}
            type="league"
          />

          <Favorites 
            favoriteArr={favoriteCups}
            type="cup"
          />

          <Favorites 
            favoriteArr={favoriteTeams}
            type="team"
          />

        </div>

      </div>
  );
}

export default HomeLoggedIn;
