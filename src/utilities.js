export const getBearerToken = () => {
  return localStorage.getItem('jwtToken')
}