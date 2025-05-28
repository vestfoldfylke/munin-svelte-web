export const checkRoles = (user, roles) => {
  if (!user || !user.roles) {
    return false
  }
  return roles.some(role => user.roles.includes(role))
}
