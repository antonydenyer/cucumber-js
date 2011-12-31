var Listener               = {};
Listener.ProgressFormatter = require('./listener/progress_formatter');
Listener.PrettyFormatter = require('./listener/pretty_formatter');
Listener.listeners         =  {
  "progress": Listener.ProgressFormatter,
  "pretty": Listener.PrettyFormatter
};
module.exports             = Listener;
