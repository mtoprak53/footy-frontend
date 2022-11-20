import React, { useState, useEffect, useContext } from "react";
import UserContext from "../auth/userContext";
import { Link } from "react-router-dom";
import axios from "axios";
import FavoriteHandler from "./FavoriteHandler";
import LoadingSpinner from "../common/LoadingSpinner.js"
import ErrorPage from "../common/ErrorPage";
import ls from "localstorage-ttl";
import Heading from "./Heading";
import "./Cup.css";
import { months } from "../config";

const Cup = (props) => {
  const { favoriteCups } = useContext(UserContext);
  const rounds = props.data.cupData.rounds;
  const { timezone }= useContext(UserContext).currentUser;
  const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3/";

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [round_, setRound_] = useState(rounds[rounds.length - 1]);

  const showRound = async (round, evt) => {
    console.log(`showRound >> ${evt}, ${round}`);

    let route = `fixtures?league=${props.id}`;
        route += `&season=${props.season}`;
        route += `&round=${round}`;
        route += `&timezone=${timezone}`;

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
          const oneHour = 86400000;
          ls.set(route, res, oneHour);
        }
        setData(res.data.response);
        setRound_(round);
        setStatus("fetched");
      } catch (err) {
        setError(err);
      }      
    }

    axiosData();
  }


  useEffect(() => {
    showRound(round_);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {}, [round_]);

  if (!rounds.length) {
    return <ErrorPage message="There is no fixture for this season yet."/>;
  };  

  if (status !== "fetched") return <LoadingSpinner />;
  if (error) {
    return <ErrorPage message="Sorry, something went wrong :("/>;
  }

  return (
    <div className="Cup mt-5 m-md-2 m-lg-3">

      <FavoriteHandler 
        id={+props.id} 
        type="cup" 
        favsArr={favoriteCups} 
      />

      <Heading 
        header={"Cup Rounds"}
        logo={data[0].league.logo}
        name={data[0].league.name}
        country={data[0].league.country}
        flag={data[0].league.flag}
      />

      <div className="Cup-rounds-container text-center">
        <ul className="Cup-rounds">
          {rounds.map(round => (
            <li key={round}>
              <button href="#"
                  id={round} 
                  type="button" 
                  className={
                    `btn btn-outline-dark m-1` 
                    + (round === round_ ? " activeRound" : "")
                  }
                  onClick={((evt) => showRound(round, evt))}>
                <h5>{round}</h5>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="CupRound center-container mt-5">
        <ul className="list">
            {data
              .sort((a, b) => {
                const timeA = a.fixture.date.slice(5,16);
                const timeB = b.fixture.date.slice(5,16);
                if (timeA < timeB) return -1;
                if (timeA > timeB) return 1;
                return 0;
              })
              .map(game => (
              <li key={game.fixture.id}>

                <div className="match-container row d-flex align-items-center">

                  <div className="date-time col-3 col-md-2 text-right">
                    {`${months[+game.fixture.date.slice(5, 7) - 1]} 
                      ${game.fixture.date.slice(8, 10)} 
                      ${game.fixture.date.slice(11, 16)}`}
                  </div>

                  <div className="game-container col row">

                    <div className="home-team col">
                      <div className="CupRound-home-team-logo team-logo mr-1">
                        <img src={game.teams.home.logo} alt="logo-home" />
                      </div>
                      <div className="CupRound-team-home team-name">
                        <Link 
                          to={{ pathname: `/teams/${game.teams.home.id}` }}
                        ><span className={game.teams.home.winner ? "font-weight-bold" : ""}>
                          {game.teams.home.name}
                        </span></Link>
                      </div>
                    </div>
                    
                    <div className="CupRound-score game score col-2">
                      {game.fixture.status.short !== "NS"
                        ?
                        (game.goals.home ===null ? "" : +game.goals.home)
                        + " - " 
                        + (game.goals.away === null ? "" : +game.goals.away) 
                        :
                        " - "}
                    </div>

                    <div className="away-team col">
                      <div className="CupRound-team-away team-name">
                        <Link 
                          to={{ pathname: `/teams/${game.teams.away.id}` }}
                        ><span className={game.teams.away.winner ? "font-weight-bold" : ""}>
                          {game.teams.away.name}
                        </span></Link>
                      </div>
                      <div className="CupRound-away-team-logo team-logo ml-1">
                        <img src={game.teams.away.logo} alt="logo-away" />
                      </div>
                    </div>

                  </div>

                </div>            

              </li>
            ))}
        </ul>
      </div>

    </div>
  )
}

export default Cup;