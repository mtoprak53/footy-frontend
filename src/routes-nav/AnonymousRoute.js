import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "../auth/userContext";

/** "Higher-Order Component" for private routes. 
 * 
 * In routing component, use these instead of <Route ...>. This component 
 * will check if there is a valid current user and only continues to the 
 * roiute if so. If no user present, redirects to login form.
 */

function AnonymousRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);

  console.debug(
      "AnonymousRoute",
      "exact=", exact,
      "path=", path,
      "currentUser=", currentUser,
  );

  if (currentUser) {
    return <Redirect to="/league" />;
    // return <Redirect to="/" />;
    // return null;
  }

  return (
      <Route exact={exact} path={path}>
        {children}
      </Route>
  );
}

export default AnonymousRoute;
