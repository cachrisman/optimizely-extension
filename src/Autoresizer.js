import { Component } from "react";

export default class Autoresizer extends Component {
  componentDidMount() {
    this.props.window.startAutoResizer();
  }

  componentWillUnmount() {
    this.props.window.stopAutoResizer();
  }

  render() {
    return null;
  }
}
