import React from "react";
import { worldLogo } from "../config";

const Heading = ({ header, logo, name, country, flag }) => {
  
  const newName = name.replace('Turkey', 'Türkiye');
  const newCountry = country.toUpperCase().replace('TURKEY', 'TÜRKİYE');

  return (
    <div className="Heading m-5">

      <h1 className="header text-center">{header}</h1>

      <div className="Heading-container">
        <div className="Heading-header-container container">

          <div className="Heading-info-container row">
            <div className="Heading-component col row d-flex align-items-center">
              <div className="col-4"><img src={logo} alt="" /></div>
              <div className="image-header d-flex align-items-center col">
                {/* <h2>{name}</h2> */}
                <h2>{newName}</h2>
              </div>
            </div>

            <div className="Heading-country col row d-flex align-items-center">
              <div className="image-header d-flex align-items-center justify-content-end col">
                {/* <h2 className="">{country}</h2> */}
                <h2 className="">{newCountry}</h2>
              </div>
              <div className="col-4">
                <img src={country === "World" 
                        ? worldLogo
                        : flag} 
                    className="rounded-pill" alt=""/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
};


export default Heading;