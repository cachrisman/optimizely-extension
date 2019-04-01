import React from "react";
import PropTypes from "prop-types";
import {
  TextField,
  SelectField,
  Option,
  Button,
  FormLabel,
  Heading
} from "@contentful/forma-36-react-components";
import InputRange from "react-input-range";

export default class CreateExperiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = CreateExperiment.getInitialState();
    this.setValue = this.setValue.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  static getInitialState() {
    return {
      isLoading: false,
      values: {
        text: "",
        buttonText: "",
        buttonColor: "info"
      },
      showContextSettings: false,
      contextType: "no-context",
      contextValue: "",
      percent: 50
    };
  }

  setValue(name) {
    return e => {
      const value = e.target.value;
      this.setState(state => ({
        values: {
          ...state.values,
          [name]: value
        }
      }));
    };
  }

  onSubmitClick() {
    const { percent, values, contextType, contextValue } = this.state;
    this.setState({ isLoading: true });
    this.props
      .onCreateExperiment({
        values,
        percent,
        contextType,
        contextValue
      })
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <div>
        <Heading style={{ marginBottom: 20 }}>
          Create a new Optimizely experiment
        </Heading>
        <TextField
          countCharacters
          labelText={`Experimental value for "Text"`}
          name="text"
          id="text"
          value={this.state.values.text}
          onChange={this.setValue("text")}
          textInputProps={{
            maxLength: 256,
            width: "full"
          }}
        />
        <TextField
          countCharacters
          labelText={`Experimental value for "Button Text"`}
          name="buttonText"
          id="buttonText"
          value={this.state.values.buttonText}
          onChange={this.setValue("buttonText")}
          textInputProps={{
            maxLength: 256,
            width: "full"
          }}
        />
        <SelectField
          id="buttonColor"
          name="buttonColor"
          labelText={`Experimental value for "Button Color"`}
          value={this.state.values.buttonColor}
          onChange={this.setValue("buttonColor")}
          selectProps={{
            width: "medium"
          }}
        >
          <Option value="info">info</Option>
          <Option value="danger">danger</Option>
          <Option value="warning">warning</Option>
        </SelectField>
        <div style={{ width: 400, marginBottom: 40, marginTop: 40 }}>
          <FormLabel htmlFor="percent" style={{ marginBottom: 20 }}>
            Show experiment for the following percentage of users:
          </FormLabel>
          <InputRange
            id="percent"
            maxValue={100}
            minValue={0}
            value={this.state.percent}
            onChange={value => this.setState({ percent: value })}
          />
        </div>
        <FormLabel
          style={{ borderBottom: "1px dotted blue", cursor: "pointer" }}
          onClick={() => {
            this.setState(state => ({
              showContextSettings: !state.showContextSettings
            }));
          }}
        >
          Specify context of experiment
        </FormLabel>
        {this.state.showContextSettings && (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flexGrow: "1" }}>
              <SelectField
                id="contextType"
                name="contextType"
                value={this.state.contextType}
                onChange={e => {
                  this.setState({ contextType: e.target.value });
                }}
              >
                <Option value="no-context">No context</Option>
                <Option value="url-includes">URL Includes</Option>
                <Option value="url-equals">URL Equals</Option>
                <Option value="specified-context">Specified Context</Option>
              </SelectField>
            </div>
            {this.state.contextType !== "no-context" && (
              <div style={{ flexGrow: "2", marginLeft: 20 }}>
                <TextField
                  id="contextTypeValue"
                  name="contextTypeValue"
                  value={this.state.contextValue}
                  onChange={e => {
                    this.setState({ contextValue: e.target.value });
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 20 }} />
        <div style={{ display: "flex" }}>
          <Button loading={this.state.isLoading} onClick={this.onSubmitClick}>
            Create experiment
          </Button>
        </div>
      </div>
    );
  }
}

CreateExperiment.propTypes = {
  onCreateExperiment: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};
