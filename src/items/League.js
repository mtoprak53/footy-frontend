import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/userContext";
import Heading from "./Heading";
import "./League.css";

const League = (props) => {
  console.log("League  >>  props");
  console.log(props);

  // if (props.data)

  const { favoriteLeagues, favorite, unfavorite } = useContext(UserContext);

  const data = JSON.parse(props.data);
  console.log("League");
  // const { season, country, flag, logo, name, standings } = data;
  const { id, country, flag, logo, name, standings } = data;

  console.log("favoriteLeagues >>> ");
  console.log(favoriteLeagues);

  return (
    <div key={props.data} className="League d-flex justify-content-center">
    {/* <div key={props.data} className="League justify-content-center"> */}
    {/* <div key={props.data} className="League m-auto"> */}
      <div className="League-container mt-5">

        <div className="League-Favorite-Button">
          {favoriteLeagues.filter(l => l.id === id).length === 1
            ?
            <div className="d-flex justify-content-center">
              <h4 className="mr-3">One of your favorite leagues</h4> 
              <button type="button" 
                      className="btn btn-outline-danger" 
                      onClick={(() => unfavorite("league", id))}>REMOVE</button>
            </div>
            : 
            <div className="d-flex justify-content-center">
              <h4 className="mr-3">Not a favorite league of yours</h4> 
              <button type="button" 
                      className="btn btn-success"
                      onClick={(() => favorite("league", id))}>ADD</button>
            </div>
          }
        </div>

        <Heading 
          header={"League Standing"}
          logo={logo}
          name={name}
          country={country}
          flag={flag}
        />

        <table className="table">
          <thead>
            <tr>
              {["#", "Team", "Pl", "W", "D", "L", "GF", "GA", "GD", "Po"].map(
                text => (<th scope="col" key={text}>{text}</th>)
              )}
            </tr>
          </thead>
          <tbody>
            {standings[0].map(
              team => (<tr key={team.rank}>
                <th scope="row">{team.rank}</th>
                <td>
                  <div className="League-table-team-logo mr-2">
                    <img className="image-table" src={team.team.logo} alt=""  />
                  </div>
                  <Link to={{ pathname: `/teams/${team.team.id}` }}>
                    <span className="team-name">
                      {team.team.name}
                    </span>
                  </Link>
                </td>
                {[
                  team.all.played, 
                  team.all.win, 
                  team.all.draw, 
                  team.all.lose, 
                  team.all.goals.for, 
                  team.all.goals.against, 
                  team.goalsDiff, 
                  team.points
                ].map((text, idx) => (<td key={`${team.rank}-${idx}`}>{text}</td>))}
            </tr>))}
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default League;