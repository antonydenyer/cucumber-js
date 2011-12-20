var Listener               = {};
Listener.ProgressFormatter = require('./listener/progress_formatter');
Listener.TeamCityFormatter = require('./listener/team_city_formatter');
Listener.listeners         =  {
  "progress": Listener.ProgressFormatter,
  "teamcity": Listener.TeamCityFormatter
};
module.exports             = Listener;
