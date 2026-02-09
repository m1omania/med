export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return null
  // In real app: fetch from DB. Here we don't have stored results on server;
  // client stores in Pinia/localStorage. So we return null and client uses store.
  // For SSR we need to either pass result in payload or store in cookie/session.
  return null
})
