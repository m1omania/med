import data from '../data/disease-types.json'

export default defineEventHandler(() => data || { categories: [] })
