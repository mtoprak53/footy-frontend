import React from "react";
// import { React, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
// import AnonymousRoute from "./AnonymousRoute";
import PrivateRoute from "./PrivateRoute";
import Competition from "../items/Competition";
// import Competition2 from "../items/Competition2";
// import Leagues from "../items/Leagues";
// import Cups from "../__obsolete/Cups";
// import CupRound from "../items/CupRound";
// import Team from "../items/Team";
import Teams from "../items/Teams";
// import Home from "../items/maybe/Home";
// import ErrorPage from "../common/ErrorPage";
import { 
  defaultTeamId, 
  defaultLeagueId, 
  defaultCupId, 
  defaultSeason 
} from "../config";

/** Side-wide routes. 
 * 
 * Parts of side should only be visitable when logged in. Those routes are 
 * wrapped by <PrivateRoute>, which is an authorization component.
 * 
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({ login, signup }) {
  console.debug(
      "Routes",
      `login=${typeof login}`,
      `register=${typeof register}`,
  );
    
  return (
    <div className="pt-5">
      <Switch>

        {/* <AnonymousRoute exact path="/"> */}
        <Route exact path="/">
          <Homepage />
        </Route>
        {/* </AnonymousRoute> */}

        {/* <AnonymousRoute exact path="/login"> */}
        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>
        {/* </AnonymousRoute> */}

        {/* <AnonymousRoute exact path="/signup"> */}
        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>
        {/* </AnonymousRoute> */}
        

        {/* <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute> */}

        {/* <PrivateRoute exact path="/teams/:team_name"> */}
        <PrivateRoute exact path="/teams/:teamId">
          <Teams />
        </PrivateRoute>

        <PrivateRoute exact path="/teams">
          <Redirect to={`/teams/${defaultTeamId}`} />
        </PrivateRoute>

        {/* <PrivateRoute exact path="/:type/:id/:season">
          <Competition />
        </PrivateRoute> */}

        <PrivateRoute exact path="/league/:id/:season">
          <Competition type="league" />
        </PrivateRoute>

        <PrivateRoute exact path="/league">
          <Redirect to={`/league/${defaultLeagueId}/${defaultSeason}`} />
        </PrivateRoute>

        <PrivateRoute exact path="/cup/:id/:season">
          <Competition type="cup" />
        </PrivateRoute>

        <PrivateRoute exact path="/cup">
          <Redirect to={`/cup/${defaultCupId}/${defaultSeason}`} />
        </PrivateRoute>

        {/* <PrivateRoute exact path="/league"> */}
        {/* <PrivateRoute exact path="/:type">
          <ErrorPage message="This is not a legit route address!!"/>
        </PrivateRoute> */}

        {/* <PrivateRoute exact path="/cup">
          <Competition />
        </PrivateRoute> */}

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;