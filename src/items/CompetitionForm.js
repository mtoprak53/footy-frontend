import React from "react";
import { mainNations } from "../config";

const CompetitionForm = ({ 
  countries, 
  country, 
  leagues, 
  cups, 
  seasons, 
  handleChange, 
  // handleSubmit, 
  countryValue, 
  leagueValue, 
  cupValue, 
  seasonValue, 
}) => {
  console.log(`CompetitionForm >>`);

  return (
    <div className="CompetitionForm container">
      <form className="form-inline justify-content-around" 
            // onSubmit={handleSubmit}
      >

        <div className="form-group col-4">
          <select
            value={countryValue}
            name="country"
            className="form-control w-100" 
            // defaultValue={country}
            onChange={handleChange}
          >
            <option value="" key="heading"
                    className="text-center font-weight-bold">
              -- COUNTRIES --
            </option>

            {mainNations.map(
              country => (
                <option value={country} key={country}
                        className="font-weight-bold">
                  {country.replace("Turkey", "Türkiye")}
                </option>
              )
            )}

            {countries.filter(c => !mainNations.includes(c.name) )
              .map(country => (
                <option value={country.name} key={country.name}>
                  {country.name}
                </option>)
            )}
          </select>
        </div>

        <div className="form-group col-5">
        <div className="row w-100 m-0 p-0">
        
        <div className="form-group col">
          <select
            value={leagueValue}
            id="league"
            name="league"
            className="form-control w-100" 
            onChange={handleChange}
          >
            <option value="" key="heading"
                    className="text-center font-weight-bold">
              -- LEAGUES --
            </option>
            {leagues.map(league => 
              <option value={league.id} 
                      key={league.id}>
                {league.name}
              </option>
            )}
          </select>
        </div>
        
        <div className="form-group col">
          <select
            value={cupValue}
            id="cup"
            name="cup"
            className="form-control w-100" 
            onChange={handleChange}
          >
            <option value="" key="heading"
                    className="text-center font-weight-bold">
              -- CUPS --
            </option>
            {cups.map(cup => 
              <option value={cup.id} 
                      key={cup.id}>
                {cup.name}
              </option>
            )}
          </select>
        </div>

        </div>
        </div>
        {/* <div className="row"></div> */}
        
        <div className="form-group col-3">
          <select
            value={seasonValue}
            id="season"
            name="season"
            className="form-control w-100" 
            // defaultValue="2022"
            onChange={handleChange}
          >
            <option value="" key="heading"
                    className="text-center font-weight-bold">
              -- SEASON --
            </option>
            {seasons.sort((a, b) => b - a).map(season => 
              <option value={season} 
                      key={season}>
                {+season}/{(+season+1) % 100}
              </option>
            )}
          </select>
        </div>
        
        {/* <button
            type="submit"
            className="btn btn-primary col"
        >
          Submit
        </button> */}
      </form>
    </div>
  )
}

export default CompetitionForm;