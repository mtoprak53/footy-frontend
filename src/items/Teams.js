import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import TeamForm from "./TeamForm";
import Team from "./Team";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorPage from "../common/ErrorPage";
import FootyApi from "../api/api";
import {
  BASE_URL, 
  defaultVenueImage, 
  defaultCountry, 
  defaultTeamId, 
  defaultLeagueId, 
  defaultSeason, 
  oneMonthInMs 
} from "../config";
import UserContext from "../auth/userContext"
import ls from "localstorage-ttl";
import "./Teams.css";

const Teams = () => {
  const { countries } = useContext(UserContext);
  let { teamId } = useParams();
  const history = useHistory();

  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  /** { countryName, leagueId, teamName } */
  const [teamInfo, setTeamInfo] = useState({
    countryName: null,
    leagueId: null,
    teamId: teamId
  });
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  async function getLeagues(country) {
    try {
      const res = await FootyApi.getCountrysLeagues(country);
      setLeagues(leagues => [
        {
          id: null, 
          country: country, 
          name: "Nationals"
        }, 
        ...res
      ]);
      return;
    } catch (errors) {
      console.error("getCountriesLeagues failed", errors);
      return { success: false, errors };
    }
  };


  const axiosLeaguesTeams = async (leagueId) => {
    setStatus("fetching");

    const route = `teams?league=${leagueId}&season=${defaultSeason}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_API_HOST
      },
      url: BASE_URL + route
    };

    let res;
    try {
      if (ls.get(route)) {
        res = ls.get(route);
      } else {
        res = await axios.request(options);
        ls.set(route, res, oneMonthInMs);
      }
      setTeams(res.data.response.sort((a, b) => {
        const nameA = a.team.name.toUpperCase();
        const nameB = b.team.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }));
      setStatus("fetched");
    } catch (err) {
      console.error(err);
    }
  };


  const axiosNationalTeams = async (countryName) => {
    setStatus("fetching");

    const route = `teams?country=${countryName}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_API_HOST
      },
      url: BASE_URL + route
    };

    let res;
    try {
      if (ls.get(route)) {
        res = ls.get(route);
      } else {
        res = await axios.request(options);
        ls.set(route, res, oneMonthInMs);
      }
      const nationals = res.data.response.filter(t => t.team.national);
      setTeams(nationals);
      setStatus("fetched");
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    const route = `teams?id=${teamId}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_API_HOST
      },
      url: BASE_URL + route
    }

    const axiosData = async () => {
      setStatus("fetching");
      let res;
      try {
        if (ls.get(route)) {
          res = ls.get(route);
        } else {
          res = await axios.request(options);
          ls.set(route, res, oneMonthInMs);
        }
          
        let country_;
        if (res.data.response && res.data.response.length) {

          const t = res.data.response[0];
          const teamInfo = {
            id: t.team.id,
            name: t.team.name,
            code: t.team.code,
            country: t.team.country,
            founded: t.team.founded,
            national: t.team.national,
            logoUrl: t.team.logo,
            venueId: t.venue.id
          };
  
          /** SAVE THE TEAM INTO THE DB IF IT IS NOT SAVED YET */
          const teamCheck = await FootyApi.getTeam(t.team.id);
          if (!teamCheck) await FootyApi.saveTeam(teamInfo);
          setData(t);
          
          if (!teamInfo.countryName) {
            country_= res.data.response[0].team.country;
            setTeamInfo(teamInfo => ({
              ...teamInfo,
              countryName: country_
            }));
            getLeagues(country_);
            axiosLeaguesTeams(defaultLeagueId);
          };

        } else {
          setError("No such a team ID!");
        }          
        setStatus("fetched");
      } catch (err) {
        console.error(err);
      }
    }
    axiosData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);


  /**   HANDLE CHANGE   */
  /**   *************   */

  /** Update form data field */
  async function handleChange(evt) {
    const { name, value } = evt.target;

    if (name === "country") {
      getLeagues(value);
      setTeamInfo(teamInfo => ({
        countryName: value,
        leagueId: null,
        teamId: null
      }));
    }

    if (name === "league" && value) {
      if (value === leagues[0].country) {
        axiosNationalTeams(leagues[0].country);
      } else {
        axiosLeaguesTeams(value);
      }

      setTeamInfo(teamInfo => ({
        ...teamInfo,
        leagueId: value,
        teamId: null
      }));
    }

    if (name === "team" && value) {
      setTeamInfo(teamInfo => ({
        ...teamInfo,
        teamId: value
      }));

      history.push(`/teams/${value}`);
    }
  }
  
  if (status !== "fetched") return <LoadingSpinner />;
  if (error) {
    console.log("ERROR-1");
    return <ErrorPage message={error} />;
  }

  return (
    <div className="Teams-container">
      <TeamForm 
        countries={countries}
        leagues={leagues} 
        teams={teams}
        handleChange={handleChange}
        countryValue={teamInfo.countryName || defaultCountry}
        leagueValue={teamInfo.leagueId || defaultLeagueId}
        teamValue={teamInfo.teamId}
      />

      <Team 
        id={data.team.id}
        name={
          data.team.national 
          ? `${data.team.name} National Team` 
          : data.team.name
        }
        logo={data.team.logo}
        country={data.team.country.toUpperCase()}
        flag={countries.filter(c => c.name === (data.team.country || data.team.name))[0].flagUrl}
        founded={data.team.founded ? data.team.founded : "-"}
        venue={data.venue.name}
        city={data.venue.city}
        capacity={data.venue.capacity}
        image={+teamId === defaultTeamId ? defaultVenueImage : data.venue.image}
      />
    </div>
  )
};

export default Teams;
