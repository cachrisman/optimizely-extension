import React from "react";
import ReactDOM from "react-dom";
import { init } from "contentful-ui-extensions-sdk";
import "@contentful/forma-36-fcss/dist/styles.css";
import "react-input-range/lib/css/index.css";
import CreateExperiment from "./CreateExperiment";
import { FormLabel } from "@contentful/forma-36-react-components";
import Experiment from "./Experiment";
import * as API from "./api";
import Autoresizer from "./Autoresizer";

class App extends React.Component {
  state = {
    showForm: false
  };

  onCreateExperiment = async ({
    values,
    percent,
    contextType,
    contextValue
  }) => {
    const sys = this.props.entry.getSys();
    const id = sys.id;
    const contentTypeId = sys.contentType.sys.id;
    const timestamp = Date.now();
    const eventKey = `event-${contentTypeId}-${id}-${timestamp}`;
    const experimentKey = `experiment-${contentTypeId}-${id}-${timestamp}`;

    const event = await API.createEvent({
      key: eventKey,
      description: `Event for experiment ${experimentKey}`
    });

    const experimentWeight = percent * 100;

    const experiment = await API.createExperiment({
      key: experimentKey,
      description: `Experiment for ${contentTypeId}-${id}`,
      variations: [
        {
          key: "default",
          status: "active",
          weight: 10000 - experimentWeight
        },
        {
          key: "alternative",
          status: "active",
          weight: experimentWeight
        }
      ],
      metrics: [
        {
          event_id: event.id,
          aggregator: "count",
          scope: "visitor",
          winning_direction: "increasing"
        }
      ]
    });

    await this.props.field.setValue({
      eventId: event.id,
      eventKey: event.key,
      variations: {
        alternative: {
          ...values
        }
      },
      context: {
        contextType,
        contextValue
      },
      experimentId: experiment.id,
      experimentKey: experiment.key
    });

    this.forceUpdate();
  };

  onStartExperiment = async id => {
    await API.startExperiment(id);
  };

  onPauseExperiment = async id => {
    await API.pauseExperiment(id);
  };

  onResumeExperiment = async id => {
    await API.resumeExperiment(id);
  };

  onDeleteExperiment = async id => {
    await API.deleteExperiment(id);
    await this.props.field.removeValue();
    this.forceUpdate();
  };

  renderForm() {}

  render() {
    const currentFieldId = this.props.field.id;
    const allFields = this.props.contentType.fields;
    const filteredFields = allFields.filter(
      field => field.id !== currentFieldId
    );
    let experimentId = null;

    if (this.props.field && this.props.field._value) {
      experimentId = this.props.field._value.experimentId;
    }
    return (
      <div>
        {experimentId ? (
          <Experiment
            experimentId={experimentId}
            field={this.props.field}
            onStartExperiment={this.onStartExperiment}
            onPauseExperiment={this.onPauseExperiment}
            onResumeExperiment={this.onResumeExperiment}
            onDeleteExperiment={this.onDeleteExperiment}
          />
        ) : this.state.showForm ? (
          <CreateExperiment
            fields={filteredFields}
            onCreateExperiment={this.onCreateExperiment}
          />
        ) : (
          <FormLabel
            style={{
              cursor: "pointer",
              borderBottom: "1px dotted blue",
              marginBottom: 0
            }}
            onClick={() => {
              this.setState(state => ({
                showForm: !state.showForm
              }));
            }}
          >
            Configure experiment
          </FormLabel>
        )}
      </div>
    );
  }
}

init(extension => {
  const { projectId, apiToken } = extension.parameters.installation;
  API.initializeClient(apiToken, projectId);
  ReactDOM.render(
    <div>
      <App {...extension} />
      <Autoresizer window={extension.window} />
    </div>,
    document.getElementById("root")
  );
});
