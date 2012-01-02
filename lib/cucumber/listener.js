var Listener               = {};
Listener.ProgressFormatter = require('./listener/progress_formatter');
Listener.PrettyFormatter = require('./listener/pretty_formatter');
Listener.SummaryFormatter = require('./listener/summary_formatter');
Listener.listeners         =  {
  "progress": Listener.ProgressFormatter,
  "summary": Listener.SummaryFormatter,
  "pretty": Listener.PrettyFormatter
};
module.exports             = Listener;
