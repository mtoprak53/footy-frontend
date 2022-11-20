import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";
import Competition from "../items/Competition";
import Teams from "../items/Teams";
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
        <Route exact path="/">
          <Homepage />
        </Route>

        <Route exact path="/login">
          <LoginForm login={login} />
        </Route>

        <Route exact path="/signup">
          <SignupForm signup={signup} />
        </Route>

        <PrivateRoute exact path="/teams/:teamId">
          <Teams />
        </PrivateRoute>

        <PrivateRoute exact path="/teams">
          <Redirect to={`/teams/${defaultTeamId}`} />
        </PrivateRoute>

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

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default Routes;