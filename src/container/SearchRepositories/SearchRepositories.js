import React, { Component } from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import client from '../../container/client'
import { SEARCH_REPOSITORIES } from '../../container/graphql'
import { __importDefault } from 'tslib';
import StarButton from '../StarButton/StarButton'

const PER_PAGE = 10
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: ""
}
class SearchRepositories extends Component {
  constructor(props) {
    super(props)
    this.state = DEFAULT_STATE
    this.myRef = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      query: this.myRef.current.value
    })
  }

  goPrevious(search) {
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }

  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }

  render() {
    console.log(this.state)
    const { query, first, last, before, after } = this.state
    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.handleSubmit}>
          <input ref={this.myRef}/>
          <input type="submit" value="Submit" />
        </form>
        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, last, before, after }}
        >
          {
            ({ loading, error, data }) => {
              if (loading) return 'Loading...'
              if (error) return `Error! ${error.message}`
              const search = data.search
              const repositoryCount = search.repositoryCount
              const title = `GitHubリポジトリ検索結果  ${repositoryCount}件`
              return (
                <React.Fragment>
                  <p>{title}</p>
                  <ul>
                    {
                      search.edges.map(edge => {
                        const node = edge.node
                        return (
                          <li key={node.id}>
                            <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                            &nbsp;
                            <StarButton node={node} {...{query, first, last, after, before}}/>
                          </li>
                        )
                      })
                    }
                  </ul>

                  { search.pageInfo.hasPreviousPage === true ? <button onClick={this.goPrevious.bind(this, search)}>Previous</button> : null }
                  { search.pageInfo.hasNextPage === true ? <button onClick={this.goNext.bind(this, search)}>Next</button> : null }
                </React.Fragment>
              )
            }
          }
        </Query>
      </ApolloProvider>
    )
  }
}

export default SearchRepositories
