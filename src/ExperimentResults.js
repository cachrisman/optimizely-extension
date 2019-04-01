import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Heading,
  TextLink
} from "@contentful/forma-36-react-components";
import * as API from "./api";

const Reach = ({ reach }) => {
  if (!reach) {
    return null;
  }
  return (
    <React.Fragment>
      <div>
        <strong>{reach.count}</strong>
      </div>
      <div>
        <small>{Math.round(reach.variation_reach * 10000) / 100}%</small>
      </div>
    </React.Fragment>
  );
};

const MetricResult = ({ metricResult }) => {
  if (!metricResult) {
    return null;
  }
  const rate = metricResult.rate || 0;
  return (
    <React.Fragment>
      <div>
        <strong>
          {metricResult.lift
            ? `${Math.round(metricResult.lift.value * 10000) / 100}%`
            : "---"}
        </strong>
      </div>
      <div>
        <small>{Math.round(rate * 1000) / 1000}</small>
      </div>
    </React.Fragment>
  );
};

export default class ExperimentResults extends Component {
  static propTypes = {
    experiment: PropTypes.object.isRequired,
    results: PropTypes.object.isRequired
  };

  render() {
    const experiment = this.props.experiment;
    const results = this.props.results;
    return (
      <React.Fragment>
        <Heading>
          Results
          <TextLink
            style={{ marginLeft: 10, fontSize: 14 }}
            href={API.getResultsUrl(
              this.props.experiment.campaign_id,
              this.props.experiment.id
            )}
            target="_blank"
          >
            See all results
          </TextLink>
        </Heading>
        <div style={{ marginTop: 20 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Variations</TableCell>
              <TableCell>Visitors</TableCell>
              {results.metrics.map(metric => (
                <TableCell key={metric.event_id}>{metric.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {experiment.variations.map(variation => {
              const id = variation.variation_id;
              const reach = results.reach.variations[id];
              const metricResults = results.metrics.map(metric => {
                return metric.results[id];
              });
              return (
                <TableRow key={`variation-${id}`}>
                  <TableCell>{variation.key}</TableCell>
                  <TableCell>
                    <Reach reach={reach} />
                  </TableCell>
                  {metricResults.map(metricResult => {
                    return (
                      <TableCell key={`metricResult-${id}`}>
                        <MetricResult metricResult={metricResult} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div style={{ marginTop: 20 }} />
      </React.Fragment>
    );
  }
}
