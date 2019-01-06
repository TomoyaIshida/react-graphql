import React from 'react'
import { Mutation } from 'react-apollo'
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from '../../container/graphql'

const StarButton = props => {
  const { node, query, first, last, before, after } = props
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`

  const StarStatus = ({addOrRemoveStar}) => {
    return (
      <button
        onClick={
          () => addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: (store, { data: { addStar, removeStar }}) => {
              const { starrable } = addStar || removeStar
              const data = store.readQuery({
                query: SEARCH_REPOSITORIES,
                variables:  { query, first, last, after, before }
              })
              const edges = data.search.edges
              const newEdges = edges.map(edge => {
                if (edge.node.id === node.id) {
                  const totalCount = edge.node.stargazers.totalCount
                  const diff = starrable.viewerHasStarred ? 1 : -1
                  const newTotalCount = totalCount + diff
                  edge.node.stargazers.totalCount = newTotalCount
                }
                return edge
              })
              data.search.edges = newEdges
              store.writeQuery({ query: SEARCH_REPOSITORIES, data })
            }
          })
        }
      >
        {starCount} {viewerHasStarred ? '| starred' : ''}
      </button>
    )
  }

  return (
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR} >
      { addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} /> }
    </Mutation>
  )
}

export default StarButton;
