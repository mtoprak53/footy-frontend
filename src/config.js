const headers = {
  "X-RapidAPI-Key": "9aaa87feb1msh1f7452fb0989f38p1d2a37jsnd6476f2b7d4d",
  "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com"
};

const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3/";

const mainNations = [
  "Turkey", 
  "Germany", 
  "Italy", 
  "England", 
  "Spain", 
  "France", 
  "World"
];

const mainNationsTeams = [
  "Turkey", 
  "Germany", 
  "Italy", 
  "England", 
  "Spain", 
  "France"
];

const defaultVenueImage = "https://cdnuploads.aa.com.tr/uploads/Contents/2016/12/15/thumbs_b_c_1f806418f2ea6c9630ca14dd33d413a3.jpg";
const defaultCountry = "Turkey";
const defaultTeam = "Trabzonspor";
const defaultTeamId = 998;   // Trabzonspor (TR)
const defaultLeagueId = 203;   // Turkish Süper Lig
const defaultCupId = 206;   // Turkish Cup
const defaultSeason = 2022;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const worldLogo = "https://m.files.bbci.co.uk/modules/bbc-morph-wr-decorative-map-international/3.0.1/img/map-398w.png";

const oneDayInMs = 86400000;
const oneWeekInMs = 86400000*7;
const oneMonthInMs = 86400000*30;
const oneYearInMs = 86400000*365;


export {
  headers, 
  BASE_URL,
  mainNations, 
  mainNationsTeams, 
  defaultVenueImage, 
  defaultCountry, 
  defaultTeam, 
  defaultTeamId, 
  defaultLeagueId, 
  defaultCupId, 
  defaultSeason, 
  months, 
  worldLogo, 
  oneDayInMs, 
  oneWeekInMs, 
  oneMonthInMs, 
  oneYearInMs, 
};