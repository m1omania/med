import data from '../data/methods.json'

export default defineEventHandler(() => ({
  methods: data.methods || [],
}))
