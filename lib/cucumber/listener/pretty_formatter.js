var PrettyFormatter = function(options) {
	var util = require('util');
	var charm = require('charm')(process);
	var eyes = require('eyes');
	var state;
	var store = {};
	var self = {
		hear: function hear(event, callback) {
			//console.log(event.getPayload());	
			//console.log("##" + event.getName());
			if (self.hasHandlerForEvent(event)) {
				//console.log("## handling ##" + event.getName());
				var handler = self.getHandlerForEvent(event);
				handler(event, callback);
			} else {
				//console.log("##" + event.getName());
				callback();
			}
		},

		hasHandlerForEvent: function hasHandlerForEvent(event) {
			var handlerName = self.buildHandlerNameForEvent(event);
			return self[handlerName] != undefined;
		},

		buildHandlerNameForEvent: function buildHandlerNameForEvent(event) {
			var handlerName = PrettyFormatter.EVENT_HANDLER_NAME_PREFIX + event.getName() + PrettyFormatter.EVENT_HANDLER_NAME_SUFFIX;
			return handlerName;
		},

		getHandlerForEvent: function getHandlerForEvent(event) {
			var eventHandlerName = self.buildHandlerNameForEvent(event);
			return self[eventHandlerName];
		},
		handleBackgroundEvent: function handleBackgroundEvent(event, callback) {
			charm.right(2).foreground("white").write("\nBackground:\n");
			self.storeLastBackgroundStep(event.getPayloadItem("background").getLastStep());
			self.isInBackground(true);
			callback();
		},
		handleBeforeFeatureEvent: function handleBeforeFeatureEvent(event, callback) {
			var feature = event.getPayloadItem("feature");
			charm.foreground("white").write("Feature: " + feature.getName() + "\n");
			charm.right(2).foreground("white").write(feature.getDescription() + "\n");
			self.hasBackground(feature.hasBackground());
			callback();
		},
		handleBeforeScenarioEvent: function handleBeforeScenarioEvent(event, callback) {
			self.storeLastScenario(event.getPayloadItem("scenario"));
			self.isScenarioPrinted(false);
			callback();
		},

		handleStepResultEvent: function handleStepResultEvent(event, callback) {
			var stepResult = event.getPayloadItem("stepResult");
			self.stepResult(stepResult);
			callback();
		},
		handleAfterStepEvent: function handleAfterStepEvent(event, callback) {

			function stepColour() {
				var stepResult = self.stepResult();
				if (stepResult.isSuccessful()) {
					return "green";
				}
				if (stepResult.isPending()) {
					return "yellow";
				}
				if (stepResult.isFailed()) {
					return "red";
				}

				return "magenta";
			};

			var step = event.getPayloadItem("step");
			self.printScenario(step);

			charm.right(4).foreground(stepColour()).write(step.getKeyword() + step.getName() + "\n");

			callback();
		},
		handleSkippedStepEvent: function(event, callback) {
			var step = event.getPayloadItem("step");
			self.printScenario(step);
			charm.right(4).foreground("cyan").write(step.getKeyword() + step.getName() + "\n");
			callback();
		},
		handleUndefinedStepEvent: function(event, callback) {
			var step = event.getPayloadItem("step");
			self.printScenario(step);
			charm.right(4).foreground("yellow").write(step.getKeyword() + step.getName() + "\n");
			callback();
		},
		printScenario: function printScenario(step) {

			function printScenario() {
				var scenario = self.getLastScenario();
				charm.right(2).foreground("white").write("Scenario: " + scenario.getName() + "\n");
				self.isScenarioPrinted(true);
			};
			if ((self.isInBackground() === true && step === self.getLastBackgroundStep())) {
				self.isInScenario(true);
			}
			else if (self.isScenarioPrinted() === false && self.isInScenario() === true) {
				charm.write("\n");
				printScenario();
			}
			else if (self.isScenarioPrinted() === false && self.hasBackground() === false) {
				printScenario();
			}
		},
		handleAfterFeaturesEvent: function handleAfterFeaturesEvent(event, callback) {
			callback();
		},
		handleAfterFeatureEvent: function handleAfterFeaturesEvent(event, callback) {
            charm.write("\n");
			callback();
		},


		handleAfterScenarioEvent: function handleAfterScenarioEvent(event, callback) {
			callback();
		},
		isInBackground: function isInBackground(background) {
			if (background !== undefined) {
				store["state"] = background === true ? "background": "";
			}
			return store["state"] === "background";
		},
		isInScenario: function isInScenario(scenario) {
			if (scenario !== undefined) {
				store["state"] = scenario === true ? "scenario": "";
			}
			return store["state"] === "scenario";
		},
		storeLastBackgroundStep: function storeLastBackgroundStep(step) {
			store["lastBackground"] = step;
		},
		getLastBackgroundStep: function getLastBackgroundStep() {
			return store["lastBackground"];
		},
		storeLastScenario: function storeLastScenario(scenario) {
			store["scenario"] = scenario;
		},
		getLastScenario: function getLastScenario() {
			return store["scenario"];
		},
		hasBackground: function hasBackground(background) {
			if (background !== undefined) {
				store["hasBackground"] = background;
			}
			return store["hasBackground"];
		},
		isScenarioPrinted: function isScenarioPrinted(printed) {
			if (printed !== undefined) {
				store["printed"] = printed;
			}
			return store["printed"] === undefined ? false: store["printed"];
		},
		stepResult: function stepResult(result) {
			if (result !== undefined) {
				store["stepResult"] = result;
			}
			return store["stepResult"];
		}

	};
	return self;
}
PrettyFormatter.EVENT_HANDLER_NAME_PREFIX = "handle";
PrettyFormatter.EVENT_HANDLER_NAME_SUFFIX = "Event";
module.exports = PrettyFormatter;

