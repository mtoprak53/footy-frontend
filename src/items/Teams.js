import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
// import Heading from "./Heading";
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
import headers from "../_data/headers.json";
import UserContext from "../auth/userContext"
import ls from "localstorage-ttl";
import "./Teams.css";

const Teams = () => {
  const { countries } = useContext(UserContext);
  // let { team_name } = useParams();
  let { teamId } = useParams();
  const history = useHistory();

  // team_name = team_name || defaultTeam;
  // teamId = teamId || defaultTeamId;

  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  /** { countryName, leagueId, teamName } */
  const [teamInfo, setTeamInfo] = useState({
    countryName: null,
    leagueId: null,
    // teamId: teamId || defaultTeamId
    teamId: teamId
  });
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  // console.log("countries");
  // console.log(countries);

  async function getLeagues(country) {
    try {
      const res = await FootyApi.getCountrysLeagues(country);
      // setLeagues(leagues => res.filter(r => r.type === "League"));
      // setLeagues(leagues => [{id: null, }, ...res]);
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
    // setFormLoaded(true);
  };


  const axiosLeaguesTeams = async (leagueId) => {
    setStatus("fetching");

    const route = `teams?league=${leagueId}&season=${defaultSeason}`;
    const options = {
      method: "GET",
      headers: headers,
      url: BASE_URL + route
    };

    let res;
    try {
      if (ls.get(route)) {
        console.log("Team >> NO API CALL >> IT IS ALREADY IN CACHE !!");
        res = ls.get(route);
      } else {
        console.log("Team >> API CALL MADE. >> IT IS NOT IN CACHE !!");
        res = await axios.request(options);
        console.log(`useAxiosTeams >> status code: ${res.status}`);
        ls.set(route, res, oneMonthInMs);
      }
      console.log(res.data.response);
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
      // setError(err);
    }
  };


  const axiosNationalTeams = async (countryName) => {
    setStatus("fetching");

    const route = `teams?country=${countryName}`;
    const options = {
      method: "GET",
      headers: headers,
      url: BASE_URL + route
    };

    let res;
    try {
      if (ls.get(route)) {
        console.log("Team >> NO API CALL >> IT IS ALREADY IN CACHE !!");
        res = ls.get(route);
      } else {
        console.log("Team >> API CALL MADE. >> IT IS NOT IN CACHE !!");
        res = await axios.request(options);
        console.log(`useAxiosTeams >> status code: ${res.status}`);
        ls.set(route, res, oneMonthInMs);
      }
      console.log(res.data.response);
      const nationals = res.data.response.filter(t => t.team.national);
      console.log(nationals);
      setTeams(nationals);
      setStatus("fetched");
    } catch (err) {
      console.error(err);
      // setError(err);
    }
  };

  // useEffect(() => {
  //   console.log("useEffect >> Teams | mount");

  // }, []);
  

  useEffect(() => {
    console.log("useEffect >> Teams | location");

    // const route = `teams?name=${team_name}`;
    // const route = `teams?name=${teamName}`;
    // const route = `teams?id=${teamId || defaultTeamId}`;
    const route = `teams?id=${teamId}`;
    const options = {
      method: "GET",
      headers: headers,
      url: BASE_URL + route
    }

    const axiosData = async () => {
      setStatus("fetching");

      let res;
      try {
        if (ls.get(route)) {
          console.log("Team >> NO API CALL >> IT IS ALREADY IN CACHE !!");
          res = ls.get(route);
        } else {
          console.log("Team >> API CALL MADE. >> IT IS NOT IN CACHE !!");
          res = await axios.request(options);
          console.log(`useAxiosTeams >> status code: ${res.status}`);

          console.log("res.data.response");
          console.log(res.data.response);

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
          console.log("teamCheck:");
          console.log(teamCheck);
          if (!teamCheck) await FootyApi.saveTeam(teamInfo);
          console.log(t);
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
        // setError(err);
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
      console.log("handleChange >> country change");
      getLeagues(value);
      setTeamInfo(teamInfo => ({
        countryName: value,
        leagueId: null,
        teamId: null
      }));
    }

    if (name === "league" && value) {
      console.log("handleChange >> league change");
      // console.log("teamInfo.countryName");
      // console.log(teamInfo.countryName);
      console.log("leagues[0].country");
      console.log(leagues[0].country);
      // const newLeague = +document.getElementById("league").value;
      // if (value === teamInfo.countryName) {
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
      console.log("handleChange >> team select");
      // const newTeam = +document.getElementById("team").value;
      setTeamInfo(teamInfo => ({
        ...teamInfo,
        teamId: value
      }));

      history.push(`/teams/${value}`);
    }

    console.log({ name, value });
  }


  // if (status !== "fetched") return <div>Loading....</div>
  // if (error) return <div>Sorry, something went wrong :(</div>
  
  if (status !== "fetched") return <LoadingSpinner />;

  if (error) {
    console.log("ERROR-1");
    return <ErrorPage message={error} />;
  }

  console.log("data");
  console.log(data);
  console.log("countries");
  console.log(countries);

  return (
    // <div className="Teams-container d-flex justify-content-center">
    <div className="Teams-container">
      <TeamForm 
        countries={countries}
        leagues={leagues} 
        teams={teams}
        handleChange={handleChange}
        countryValue={teamInfo.countryName || defaultCountry}
        leagueValue={teamInfo.leagueId || defaultLeagueId}
        // teamValue={teamInfo.teamId || defaultTeamId}
        teamValue={teamInfo.teamId}
      />

      <Team 
        // name={data.team.name}
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
