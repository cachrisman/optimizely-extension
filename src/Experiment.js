import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Spinner,
  Heading,
  Tag,
  Button
} from "@contentful/forma-36-react-components";
import * as API from "./api";
import ExperimentResults from "./ExperimentResults";

export default class Experiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
      isLoading: true,
      isError: false,
      experiment: null,
      results: null
    };
  }

  componentDidMount() {
    Promise.all([
      API.getExperiment(this.props.experimentId),
      API.getExperimentResults(this.props.experimentId)
    ])
      .then(([experiment, results]) => {
        this.setState({
          experiment,
          results,
          isLoading: false,
          isError: false
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, isError: true });
        console.log(err);
      });
  }

  onStartExperiment = () => {
    this.setState({ isBusy: true });
    this.props
      .onStartExperiment(this.state.experiment.id)
      .then(() => {
        this.setState(state => {
          return {
            experiment: {
              ...state.experiment,
              status: "running"
            },
            isBusy: false
          };
        });
      })
      .catch(() => {
        this.setState({ isBusy: false });
      });
  };

  onDeleteExperiment = () => {
    this.setState({ isBusy: true });
    this.props
      .onDeleteExperiment(this.state.experiment.id)
      .then(() => {
        this.setState({ isBusy: false });
      })
      .catch(() => {
        this.setState({ isBusy: false });
      });
  };

  onPauseExperiment = () => {
    this.setState({ isBusy: true });
    this.props
      .onPauseExperiment(this.state.experiment.id)
      .then(() => {
        this.setState(state => {
          return {
            experiment: {
              ...state.experiment,
              status: "paused"
            },
            isBusy: false
          };
        });
      })
      .catch(() => {
        this.setState({ isBusy: false });
      });
  };

  onResumeExperiment = () => {
    this.setState({ isBusy: true });
    this.props
      .onResumeExperiment(this.state.experiment.id)
      .then(() => {
        this.setState(state => {
          return {
            experiment: {
              ...state.experiment,
              status: "running"
            },
            isBusy: false
          };
        });
      })
      .catch(() => {
        this.setState({ isBusy: false });
      });
  };

  renderButtons() {
    const status = this.state.experiment.status;

    let button = null;

    if (status === "running") {
      button = (
        <Button
          loading={this.state.isBusy}
          buttonType="primary"
          onClick={this.onPauseExperiment}
        >
          Pause the experiment
        </Button>
      );
    } else if (status === "not_started") {
      button = (
        <Button
          loading={this.state.isBusy}
          buttonType="positive"
          onClick={this.onStartExperiment}
        >
          Start the experiment
        </Button>
      );
    } else if (status === "paused") {
      button = (
        <Button
          loading={this.state.isBusy}
          buttonType="positive"
          onClick={this.onResumeExperiment}
        >
          Resume the experiment
        </Button>
      );
    }

    return (
      <React.Fragment>
        {button}
        <Button
          loading={this.state.isBusy}
          style={{ marginLeft: 10 }}
          buttonType="negative"
          onClick={this.onDeleteExperiment}
        >
          Delete the experiment
        </Button>
      </React.Fragment>
    );
  }

  render() {
    if (this.state.isLoading) {
      return <Spinner size="large" />;
    }
    return (
      <div>
        <Heading>Experiment #{this.state.experiment.id}</Heading>
        <Tag>{this.state.experiment.status}</Tag>
        <pre>{JSON.stringify(this.props.field._value.context, null, 2)}</pre>
        <pre>
          {JSON.stringify(
            this.props.field._value.variations.alternative,
            null,
            2
          )}
        </pre>
        {this.state.results &&
          this.state.results.metrics && (
            <ExperimentResults
              experiment={this.state.experiment}
              results={this.state.results}
            />
          )}
        {this.renderButtons()}
      </div>
    );
  }
}

Experiment.propTypes = {
  experimentId: PropTypes.number.isRequired,
  field: PropTypes.object.isRequired,
  onStartExperiment: PropTypes.func.isRequired,
  onPauseExperiment: PropTypes.func.isRequired,
  onResumeExperiment: PropTypes.func.isRequired,
  onDeleteExperiment: PropTypes.func.isRequired
};
