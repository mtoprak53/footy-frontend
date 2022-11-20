import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../common/LoadingSpinner.js"
import ErrorPage from "../common/ErrorPage";
import CompetitionForm from "./CompetitionForm";
import League from "./League";
import Cup from "./Cup";
import FootyApi from "../api/api";
import UserContext from "../auth/userContext"
import ls from "localstorage-ttl";
import "./Competition.css";
import { 
  BASE_URL, 
  defaultCountry, 
  defaultSeason, 
  oneDayInMs, 
  oneWeekInMs 
} from "../config";

const Competition = ({ type }) => {
  const { countries } = useContext(UserContext);
  let { id, season } = useParams();
  const history = useHistory();
  const location = useLocation();

  // Async Handlers
  const [dataLoaded, setDataLoaded] = useState(false);

  // CompetitionForm
  const [leagues, setLeagues] = useState([]);
  const [cups, setCups] = useState([]);
  const [seasons, setSeasons] = useState([]);

  // Fetched Data
  const [leagueData, setLeagueData] = useState();
  const [cupData, setCupData] = useState();

  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  // League Info
  /** { id, name, type, season, country, flag } */
  const [leagueInfo, setLeagueInfo] = useState({ 
    type: type,
    id: id, 
    season: defaultSeason, 
    isCup: type === "cup", 
    country: id ? null : defaultCountry, 
  });


  async function getCupCountry(id) {
    try {
      const res = await FootyApi.getCupById(id);
      return res.country;
    } catch (errors) {
      console.error("getCountriesLeagues failed", errors);
      return { success: false, errors };
    }
  };

  async function getLeagues(country) {
    try {
      const res = await FootyApi.getCountrysLeagues(country);
      setLeagues(leagues => res.filter(r => r.type === "League"));
      setCups(cups => res.filter(r => r.type === "Cup"));
      return;
    } catch (errors) {
      console.error("getCountriesLeagues failed", errors);
      return { success: false, errors };
    }
  };
 
  /**   USE EFFECT - INITIAL */
  /**   **************************   */  

  useEffect(() => {
    console.log("useEffect >> mount");

    const route = "leagues/seasons";
    
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_API_KEY,
        "X-RapidAPI-Host": process.env.REACT_APP_API_HOST
      },
      url: BASE_URL + route 
    }

    const axiosSeasons = async () => {
      setStatus("fetching");      
      let res;     
      try {
        if (ls.get(route)) {
          console.log("NO API CALL >> IT IS ALREADY IN CACHE !!");
          res = ls.get(route); 
        } 
        else {
          console.log("API CALL MADE. >> IT IS NOT IN CACHE !!");
          res = await axios.request(options);
          console.log(`useAxiosSeasons >> status code: ${res.status}`);
          ls.set(route, res, oneWeekInMs);
        }

        setSeasons(res.data.response);
        console.log("*******  SEASON DATA  *******");
        console.log(res.data.response);

        setStatus("fetched");
      } 
      catch (err) {
        console.error(err);
        setError(err);
      }
      setDataLoaded(true);
    }

    setDataLoaded(false);
    axiosSeasons();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**   USE EFFECT */

  useEffect(() => {
    console.log("useEffect >> submitToggle");

    let route;
    
    if (type === "league") route = "standings?";
    if (type === "cup") route = "fixtures/rounds?";
    if (!route) return;  // Avoid error API call
    route += `league=${id}&season=${season}`;
    
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
          console.log("NO API CALL >> IT IS ALREADY IN CACHE !!");
          res = ls.get(route); 
        } 
        else {
          console.log("API CALL MADE. >> IT IS NOT IN CACHE !!");
          res = await axios.request(options);
          console.log(`useAxios >> status code: ${res.status}`);
          ls.set(route, res, oneDayInMs);
        }

        let country_;

        if (type === "league") {
          console.log(res.data.response);
          if (res.data.response && res.data.response.length) {
            setLeagueData(res.data.response[0].league);
            country_= res.data.response[0].league.country;
          } else {
            setLeagueData(["empty"]);
            setLeagues(["empty"]);
            setCups(["empty"]);
            setError("No such a league ID or season!");
          }          
        }      

        if (type === "cup") {
          if (res.data.response && res.data.response.length) {
            setCupData({
              ...cupData, 
              rounds: res.data.response
            });
            country_ = await getCupCountry(id);
          } else {
            setCupData(["empty"]);
            setLeagues(["empty"]);
            setCups(["empty"]);
            setError("No such a cup ID or season!");
          }
        }

        setLeagueInfo({
          ...leagueInfo,
          id: id, 
          type: type,
          season: season, 
          country: country_
        });

        getLeagues(country_);
        setStatus("fetched");
      } 
      catch (err) {
        setError(err);
      }
      setDataLoaded(true);
    }

    setDataLoaded(false);
    axiosData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location.pathname ]);

  
  /**   HANDLE CHANGE   */
  /**   *************   */

  /** Update form data field */
  async function handleChange(evt) {
    const { name, value } = evt.target;
    let newId, newSeason, newType;

    if (name === "country") {
      document.getElementById("season").value="";
      getLeagues(value);
      setLeagueInfo(leagueInfo => ({
        ...leagueInfo,
        country : value, 
        id: null, 
        name: null,  
      }));
    }

    if (name === "league" && value) {
      document.getElementById("cup").value="";
      document.getElementById("season").value="";
      newId = +document.getElementById("league").value;
      setLeagueInfo(leagueInfo => ({
        ...leagueInfo,
        type : "league",
        id : newId,
        name: leagues.filter(l => l.id === newId)[0].name
      }));
    }

    if (name === "cup" && value) {
      document.getElementById("league").value="";
      document.getElementById("season").value="";
      newId = +document.getElementById("cup").value;
      setLeagueInfo(leagueInfo => ({
        ...leagueInfo,
        type : "cup",
        id : newId,
        name: cups.filter(c => c.id === newId)[0].name
      }));
    }

    if (name === "season") {
      newSeason = +document.getElementById("season").value;
      setLeagueInfo(leagueInfo => ({
        ...leagueInfo,
        season : newSeason
      }));
    }

    if (name !== "country") {
      newId = newId || id;
      newSeason = newSeason || defaultSeason;
      name === "season" ? newType = type : newType = name  
      history.push(`/${newType}/${newId}/${newSeason}`);
    }
  }


  if (
    status !== "fetched" 
    || type !== leagueInfo.type 

    /** WAIT FOR TYPE CHANGE - 1 */
    || (type === "league" && !leagueData) 

    /** WAIT FOR TYPE CHANGE - 2 */
    || (type === "cup" && !cupData)

  ) return <LoadingSpinner />;

  if (error) {
    console.log("ERROR-1");
    return <ErrorPage message={error} />;
  }

  return (
      <div className="Competition">

        {/* COMPETITION FORM COMPONENT */}
        <CompetitionForm 
          countries={countries} 
          country={leagueInfo.country} 
          leagues={leagues} 
          cups={cups} 
          seasons={seasons} 
          handleChange={handleChange} 
          countryValue={leagueInfo.country || defaultCountry}
          leagueValue={leagueInfo.id}
          cupValue={leagueInfo.id}
          seasonValue={leagueInfo.season || ""}
        />

        {/* SHOW LEAGUE OR CUP */}
        {type === "league"
        ? <League data={JSON.stringify(leagueData)} />
        : <Cup data={{cupData}} 
              id={id} 
              season={season} 
              compData={JSON.stringify(leagueData)} />}
      </div>    
  )
}

export default Competition;