import axios from "axios";

const apiClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: "https://api-football-v1.p.rapidapi.com/v3",

  headers: {
    'X-RapidAPI-Key': '9aaa87feb1msh1f7452fb0989f38p1d2a37jsnd6476f2b7d4d',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
});

export default apiClient;