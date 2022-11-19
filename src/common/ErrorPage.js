import React from "react";
import "./ErrorPage.css";

/** A general component for error message pages. */

function ErrorPage({ message }) {
  console.debug(`ErrorPage  >>  Meassage:
                ${message}`);


  return (
      <div className="ErrorPage">
        <h3>{message}</h3>
      </div>
  );
}

export default ErrorPage;
