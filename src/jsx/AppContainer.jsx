import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { fetchData } from '../actions'
import App from './App.jsx'

class AppContainer extends PureComponent {
  render() {
    return <App {...this.props} />
  }

  componentDidMount() {
    this.props.fetchData()
  }

}

function mapStateToProps(state) {
  const {
    dummyText
  } = state

  return {
    dummyText
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: () => {
      dispatch(fetchData())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
