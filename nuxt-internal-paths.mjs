/**
 * Shim for #internal/nuxt/paths when Node resolves it via package.json "imports".
 * Nuxt normally generates this in .nuxt/paths.mjs during dev/build.
 */
import { joinRelativeURL } from 'ufo'

const getAppConfig = () => ({
  baseURL: '/',
  buildAssetsDir: '/_nuxt/',
  cdnURL: '',
})

export const baseURL = () => getAppConfig().baseURL
export const buildAssetsDir = () => getAppConfig().buildAssetsDir
export const buildAssetsURL = (...path) => joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path)
export const publicAssetsURL = (...pathSegments) => {
  const appConfig = getAppConfig()
  const publicBase = appConfig.cdnURL || appConfig.baseURL
  return pathSegments.length ? joinRelativeURL(publicBase, ...pathSegments) : publicBase
}

if (typeof import.meta !== 'undefined' && import.meta.client) {
  globalThis.__buildAssetsURL = buildAssetsURL
  globalThis.__publicAssetsURL = publicAssetsURL
}
