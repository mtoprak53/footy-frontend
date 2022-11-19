import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import UserContext from "../auth/userContext";
import HomeLoggedIn from "./HomeLoggedIn";

/** Homepage of site. 
 * 
 * Shows welcome message or login/register buttons. 
 * 
 * Routed at / 
 * 
 * Routes -> Homepage
 */

function Homepage() {
  const { currentUser } = useContext(UserContext);
  console.debug("Homepage", "currentUser=", currentUser);

  return (
      <div className="Homepage">
        <div className="container text-center">
          <h1 className="mb-4 font-weight-bold">Footy</h1>
          <p className="lead">All the games in one, convenient place.</p>
          {currentUser
              ? <HomeLoggedIn user={currentUser} />
              : (
                  <p>
                    <Link className="btn btn-primary font-weight-bold mr-3"
                          to="/login">
                      Log in
                    </Link>
                    <Link className="btn btn-primary font-weight-bold mr-3"
                          to="/signup">
                      Sign up
                    </Link>
                  </p>
              )}
        </div>
      </div>
  );
}

export default Homepage;
