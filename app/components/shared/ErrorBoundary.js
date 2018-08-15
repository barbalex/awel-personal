// @flow
import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 10px;
`
const ErrorTitle = styled.div`
  margin-bottom: 10px;
`
type Props = {
  // eslint-disable-next-line flowtype/no-weak-types
  children: Object
};
type State = {
  // eslint-disable-next-line flowtype/no-weak-types
  errorInfo: Object
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      errorInfo
    })
  }

  render() {
    const { errorInfo } = this.state
    if (errorInfo) {
      return (
        <Container>
          <ErrorTitle>
            Oh je, es ist ein Fehler aufgetreten! Bericht:
          </ErrorTitle>
          <div>{errorInfo.componentStack}</div>
        </Container>
      )
    }
    const { children } = this.props
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { ...this.props })
    )

    // Normally, just render children
    // and pass all props
    return childrenWithProps
  }
}

export default ErrorBoundary
