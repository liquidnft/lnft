export const getUserStats = (from, to) => `query {
  userstats(where: {user_created: {_gte: "${from}", _lte: "${to}"}}) {
    users
    user_created
  }
}`;

export const getArtworksStats = (from, to) => `query {
  userstats(where: {artwork_created: {_gte: "${from}", _lte: "${to}"}}) {
    artworks
    artwork_created
  }
}`;

export const getArtistsStats = (from, to) => `query {
  userstats(where: {user_created: {_gte: "${from}", _lte: "${to}"}, is_artist: {_eq: true}}) {
    users
    user_created
  }
}`;
