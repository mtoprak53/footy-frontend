import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import headers from "../_data/headers.json";
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
  // defaultLeagueId, 
  // defaultCupId, 
  defaultSeason, 
  oneDayInMs, 
  oneWeekInMs 
} from "../config";

const Competition = ({ type }) => {
  const { countries } = useContext(UserContext);
  
  // let { id, season, type } = useParams();
  let { id, season } = useParams();

  // id = id || 
  //     (type === "league" && defaultLeagueId) || 
  //     (type === "cup" && defaultCupId);
  // season = season || defaultSeason;

  const history = useHistory();

  const location = useLocation();
  console.log(location);

  // Async Handlers
  // const [formLoaded, setFormLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // CompetitionForm
  // /** [{ name, flag }, ... ] */
  // const [countries, setCountries] = useState([]);
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

  console.log("Competition");
  console.log(leagueInfo);
  console.log( id, season, type );
  console.log(location.pathname);
  // console.log("leagues.length, cups.length");
  // console.log(leagues.length, cups.length);

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
    // setFormLoaded(true);
  };

  // async function getSeasons(leagueId) {
  //   try {
  //     // const res = await FootyApi.getCountrysLeagues(country);
  //     // setLeagues(leagues => res.filter(r => r.type === "League"));
  //     // setCups(cups => res.filter(r => r.type === "Cup"));
  //     // // console.log(`getLeagues >> res=`);
  //     // // console.log(res);
  //     return;
  //   } catch (errors) {
  //     console.error("getCountriesLeagues failed", errors);
  //     return { success: false, errors };
  //   }
  //   // setFormLoaded(true);
  // }
  

  /**   USE EFFECT - INITIAL */
  /**   **************************   */  

  useEffect(() => {
    console.log("useEffect >> mount");

    const route = "leagues/seasons";
    
    const options = {
      method: "GET",
      headers: headers,
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


  /**   USE EFFECT - SUBMIT TOGGLE */
  /**   **************************   */

  useEffect(() => {
    console.log("useEffect >> submitToggle");

    let route;
    
    if (type === "league") route = "standings?";
    if (type === "cup") route = "fixtures/rounds?";
    if (!route) return;  // Avoid error API call
    route += `league=${id}&season=${season}`;
    
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
          console.log("NO API CALL >> IT IS ALREADY IN CACHE !!");
          res = ls.get(route); 
        } 
        else {
          console.log("API CALL MADE. >> IT IS NOT IN CACHE !!");
          res = await axios.request(options);
          console.log(`useAxios >> status code: ${res.status}`);
          ls.set(route, res, oneDayInMs);
          // ls.set(leagueInfo.id, leagueInfo.type, oneDay*7);
        }

        let country_;
        // if (leagueInfo.type === "league") {
        
        // // FOR CUPS IN FAVORITE LEAGUES
        // if (!res.data.response[0].league) type = "cup";

        if (type === "league") {
          console.log(res.data.response);
          if (res.data.response && res.data.response.length) {
            setLeagueData(res.data.response[0].league);
            console.log("*******  LEAGUE DATA  *******");
            console.log(res.data.response[0].league);
            country_= res.data.response[0].league.country;
          } else {
            setLeagueData(["empty"]);
            setLeagues(["empty"]);
            setCups(["empty"]);
            setError("No such a league ID or season!");
            // setStatus("fetched");
            // return <ErrorPage message="Not a legit league ID"/>;
          }
          
        }      

        // if (leagueInfo.type === "cup") {
        if (type === "cup") {
          console.log(res.data.response);
          if (res.data.response && res.data.response.length) {
            setCupData({
              ...cupData, 
              rounds: res.data.response
            });
            console.log("\n*******  CUP DATA  *******\n");
            console.log(res.data.response);
            country_ = await getCupCountry(id);
          } else {
            setCupData(["empty"]);
            setLeagues(["empty"]);
            setCups(["empty"]);
            setError("No such a cup ID or season!");
            // setStatus("fetched");
            // return <ErrorPage message="Not a legit league ID"/>;
          }
        }

        setLeagueInfo({
          ...leagueInfo,
          id: id, 
          type: type,
          season: season, 
          // country: res.data.response[0].country.name
          country: country_
        });

        console.log(country_);
        getLeagues(country_);
        setStatus("fetched");
      } 
      catch (err) {
        console.error(err);
        setError(err);
      }
      setDataLoaded(true);
    }

    setDataLoaded(false);
    axiosData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location.pathname ]);

  
  // /** GO TO ERROR PAGE IF 'TYPE' IS NOT EITHER "LEAGUE" OR "CUP" */
  // if (type !== "league" && type !== "cup") {
  //   return <ErrorPage message="Type has to be either 'cup' or 'league'!!"/>;
  // };


  /**   HANDLE CHANGE   */
  /**   *************   */

  /** Update form data field */
  async function handleChange(evt) {
    const { name, value } = evt.target;
    // console.log("handleChange >> ");
    // console.log({ name, value });

    let newId, newSeason, newType;

    if (name === "country") {
      console.log("handleChange >> country change");
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
      console.log("handleChange >> league change");
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
      console.log("handleChange >> cup change");
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
      console.log("handleChange >> season change");
      console.log("id");
      console.log(id);
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

    console.log({ name, value });
  }


  // let compComponent;

  // if (type && 
  //     leagueData && 
  //     type.toLowerCase() === "league") {
  //   compComponent = <League data={JSON.stringify(leagueData)} />
  // }

  // if (type && 
  //     cupData && 
  //     type.toLowerCase() === "cup") {
  //   compComponent = <Cup data={{cupData}} 
  //                        id={id} 
  //                        season={season} 
  //                       //  compData={JSON.stringify(leagueInfo)} />
  //                        compData={JSON.stringify(leagueData)} />
  // }

  console.log("Spinner Stuff");
  console.log("status");
  console.log(status);
  console.log("type");
  console.log(type);
  console.log("leagueData");
  console.log(leagueData);
  console.log("leagueInfo");
  console.log(leagueInfo);
  console.log("cupData");
  console.log(cupData);
  console.log("leagues");
  console.log(leagues);
  console.log("cups");
  console.log(cups);
  // console.log(type, leagueData, leagueInfo, cupData, leagues, cups);

  if (
    status !== "fetched" 
    || type !== leagueInfo.type 
    // || (!leagueInfo.isCup && !leagueData) 

    /** WAIT FOR TYPE CHANGE - 1 */
    || (type === "league" && !leagueData) 
    // || (leagueInfo.isCup && !cupData)

    /** WAIT FOR TYPE CHANGE - 2 */
    || (type === "cup" && !cupData)

    // || (!leagues.length || !cups.length)
  ) return <LoadingSpinner />;

  if (error) {
    console.log("ERROR-1");
    return <ErrorPage message={error} />;
  }

  // if (leagueData[0] === "empty" || cupData[0] === "empty") {
  //   console.log("ERROR-2");
  //   return <ErrorPage message="Sorry, this season does not have any schedule yet! :("/>
  // }

  // function errorFunc() {
  //   return <ErrorPage message="Sorry, something went wrong :("/>;
  // }


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
          // leagueValue={leagueInfo.id || (!leagueInfo.isCup && defaultLeagueId)}
          leagueValue={leagueInfo.id}
          // cupValue={leagueInfo.id || (leagueInfo.isCup && defaultCupId)}
          cupValue={leagueInfo.id}
          seasonValue={leagueInfo.season || ""}
        />

        {/* SHOW LEAGUE OR CUP */}
        {/* {compComponent} */}

        {type === "league"
        ? <League data={JSON.stringify(leagueData)} />
        // ? <League data={JSON.stringify(leagueInfo)} />
        : <Cup data={{cupData}} 
              id={id} 
              season={season} 
                // compData={JSON.stringify(leagueInfo)} />}
              compData={JSON.stringify(leagueData)} />}
      </div>
    
  )
}

export default Competition;