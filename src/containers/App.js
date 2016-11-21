import React, {
  PropTypes
} from 'react'
import {
  bindActionCreators
} from 'redux'
import {
  connect
} from 'react-redux'
import Topics from '../components/Topics'
import * as Actions from '../actions'
import {
  Pagination
} from 'antd'
import {
  browserHistory
} from 'react-router'


export class App extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  }

  componentWillMount = () => {
    let slugParam = this.getSlug()
    let pageParam = this.getPageNow()
    this.props.actions.getTopics({
      page: pageParam,
      tab: slugParam
    })
  }
  componentWillReceiveProps = (nextProps) => {
    const param = parseInt(nextProps.params.pageNum, 10)
    const nextParam = isNaN(param) ? 1 : param
    const slug = nextProps.params.categorySlug
    const nextSlug = slug ? slug : 'all'

    console.log(nextSlug, )
    if (this.getPageNow() !== nextParam) {
      this.props.actions.getTopics({
        page: nextParam,
        tab: nextSlug
      })
    }
    if (this.getSlug() !== nextSlug) {
      this.props.actions.getTopics({
        tab: nextSlug
      })
    }
  }

  getSlug = () => {
    let slugParam = this.props.params.categorySlug
    slugParam = slugParam ? slugParam : 'all'
    return slugParam
  }

  getPageNow = () => {
    let pageParam = parseInt(this.props.params.pageNum, 10)
    pageParam = isNaN(pageParam) ? 1 : pageParam
    return pageParam
  }

  onChange = (query) => {
    if (this.getSlug()) {
      browserHistory.push(`/category/${this.getSlug()}/${query}`)
      return
    }
    browserHistory.push(`/page/${query}`)
  }

  render() {
    const {
      state,
      actions
    } = this.props
    return (
      <div>
        <Topics topics={state.cnode.topicList} actions={actions} />
        <div>
          <Pagination current={this.getPageNow()} pageSize={this.props.state.cnode.limit} total={500} onChange={this.onChange} />
       </div>
     </div>
    )
  }
}


App.propTypes = {
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  state: state
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)