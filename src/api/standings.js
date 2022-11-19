import client from "./client";

const getStandings = (params) => client.get("/standings", params);

export default { getStandings };