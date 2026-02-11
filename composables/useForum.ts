const STORAGE_THREADS = 'med_forum_user_threads'
const STORAGE_REPLIES = 'med_forum_user_replies'

export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string
}

export interface ForumThread {
  id: string
  categoryId: string
  title: string
  excerpt: string
  author: string
  date: string
  repliesCount: number
  methodSlug?: string
}

export interface ForumPost {
  id: string
  author: string
  date: string
  body: string
}

export function useForum () {
  const userThreads = ref<ForumThread[]>([])
  const userReplies = ref<Record<string, ForumPost[]>>({})

  function loadFromStorage () {
    if (import.meta.client) {
      try {
        const t = localStorage.getItem(STORAGE_THREADS)
        userThreads.value = t ? JSON.parse(t) : []
      } catch {
        userThreads.value = []
      }
      try {
        const r = localStorage.getItem(STORAGE_REPLIES)
        userReplies.value = r ? JSON.parse(r) : {}
      } catch {
        userReplies.value = {}
      }
    }
  }

  function saveThreads () {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_THREADS, JSON.stringify(userThreads.value))
    }
  }

  function saveReplies () {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_REPLIES, JSON.stringify(userReplies.value))
    }
  }

  const { data: forumData } = useFetch<{
    categories: ForumCategory[]
    threads: ForumThread[]
    posts: Record<string, ForumPost[]>
  }>('/api/forum')

  const categories = computed(() => forumData.value?.categories ?? [])

  const allThreads = computed(() => {
    const base = forumData.value?.threads ?? []
    const user = userThreads.value
    const merged = [...base]
    user.forEach((t) => {
      if (!merged.some((x) => x.id === t.id)) merged.push(t)
    })
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return merged
  })

  function getThread (id: string): ForumThread | null {
    return allThreads.value.find((t) => t.id === id) ?? null
  }

  function getPosts (threadId: string): ForumPost[] {
    const base = forumData.value?.posts ?? {}
    const baseList = base[threadId] ?? []
    const thread = getThread(threadId)
    const user = userReplies.value[threadId] ?? []
    if (thread?.id.startsWith('u-') && user.length) return user
    const opPost: ForumPost | null = thread
      ? { id: `${threadId}-op`, author: thread.author, date: thread.date, body: thread.excerpt }
      : null
    const fromBase = baseList.length ? baseList : (opPost ? [opPost] : [])
    return [...fromBase, ...user]
  }

  function getRepliesCount (threadId: string): number {
    const posts = getPosts(threadId)
    return Math.max(0, posts.length - 1)
  }

  function threadsByCategory (categoryId: string): ForumThread[] {
    return allThreads.value.filter((t) => t.categoryId === categoryId)
  }

  function addReply (threadId: string, author: string, body: string) {
    const list = userReplies.value[threadId] ?? []
    const post: ForumPost = {
      id: `${threadId}-u-${Date.now()}`,
      author: author.trim() || 'Аноним',
      date: new Date().toISOString(),
      body: body.trim(),
    }
    list.push(post)
    userReplies.value = { ...userReplies.value, [threadId]: list }
    saveReplies()
  }

  function addThread (categoryId: string, title: string, body: string, author: string) {
    const id = `u-${Date.now()}`
    const date = new Date().toISOString()
    const dateShort = date.slice(0, 10)
    const authorName = author.trim() || 'Аноним'
    const bodyTrim = body.trim()
    const thread: ForumThread = {
      id,
      categoryId,
      title: title.trim(),
      excerpt: bodyTrim.slice(0, 200),
      author: authorName,
      date: dateShort,
      repliesCount: 0,
    }
    const opPost: ForumPost = {
      id: `${id}-op`,
      author: authorName,
      date,
      body: bodyTrim,
    }
    userThreads.value = [thread, ...userThreads.value]
    userReplies.value = { ...userReplies.value, [id]: [opPost] }
    saveThreads()
    saveReplies()
    return id
  }

  onMounted(loadFromStorage)
  if (import.meta.client) loadFromStorage()

  return {
    categories,
    allThreads,
    getThread,
    getPosts,
    getRepliesCount,
    threadsByCategory,
    addReply,
    addThread,
    forumData,
  }
}
