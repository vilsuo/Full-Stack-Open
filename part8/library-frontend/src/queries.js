import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    id
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query(
  $author: String,
  $genre: String
){
  allBooks(
    author: $author,
    genre: $genre,
  ) {
    title
    published
    author {
      id
      name
    }
    genres
    id
  }
}
`
export const ADD_BOOK = gql`
mutation createBook(
  $title: String!,
  $published: Int!,
  $author: String!,
  $genres: [String!]!
) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres,
  ) {
    title
    published
    author {
      id
      name
    }
    genres
    id
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor(
  $name: String!,
  $born: Int!,
) {
  editAuthor(
    name: $name,
    setBornTo: $born
  ) {
    name
    id
    born
  }
}
`

export const LOGIN = gql`
mutation login(
  $username: String!,
  $password: String!,
) {
  login(
    username: $username,
    password: $password,
  ) {
    value
  }
}
`

export const ME = gql`
query {
  me {
    id
    username
    favoriteGenre
  }
}
`
