import React from "react";
import { mainNationsTeams } from "../config";

const TeamForm = ({ 
  countries, 
  // country,  
  leagues, 
  teams, 
  handleChange, 
  // handleSubmit, 
  countryValue, 
  leagueValue, 
  teamValue
}) => {
  console.log(`TeamForm >> `);
  console.log(`teams`);
  console.log(teams);

  return (
    <div className="TeamForm container">
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

            {mainNationsTeams.map(
              country => (
                <option value={country} key={country}
                        className="font-weight-bold">
                  {country.replace("Turkey", "Türkiye")}
                </option>
              )
            )}

            {countries.filter(c => !mainNationsTeams.includes(c.name) )
              .map(country => (
              <option value={country.name} key={country.name}>
                {country.name}
              </option>)
            )}
          </select>
        </div>
        
        <div className="form-group col-4">
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

            {/* <option value="national" key="national"
                    className="font-weight-bold">
              National
            </option> */}

            {leagues.map(league => 
              <option value={league.id || league.country} 
                      key={league.id}>
                {league.name}
              </option>
            )}
          </select>
        </div>
        
        <div className="form-group col-4">
          <select
            value={teamValue}
            id="team"
            name="team"
            className="form-control w-100" 
            onChange={handleChange}
          >
            <option value="" key="heading"
                    className="text-center font-weight-bold">
              -- TEAMS --
            </option>
            {teams.map(team => 
              // <option value={team.team.name} 
              <option value={team.team.id} 
                      key={team.team.id}>
                {team.team.name.replace("Turkey", "Türkiye")}
              </option>
            )}
          </select>
        </div>

      </form>
    </div>
  )
};


export default TeamForm;