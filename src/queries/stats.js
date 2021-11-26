export const getUserStats = (date) => `query {
  userstats(where: {user_created: {_gt: "${date}"}}) {
    users
    user_created
  }
}`;

export const getArtworksStats = (date) => `query {
  userstats(where: {artwork_created: {_gt: "${date}"}}) {
    artworks
    artwork_created
  }
}`;

export const getArtistsStats = (date) => `query {
  userstats(where: {user_created: {_gt: "${date}"}, is_artist: {_eq: true}}) {
    users
    user_created
  }
}`;
