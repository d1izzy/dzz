import { Component } from 'react'

// Decorative graphics must never prevent the page or its links from working.
export default class VisualBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
