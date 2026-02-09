const toasts = ref<{ id: number; message: string; type: string }[]>([])
let id = 0

export function useToast() {
  function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
    const toastId = ++id
    toasts.value = [...toasts.value, { id: toastId, message, type }]
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId)
    }, 4000)
  }

  return {
    toasts: readonly(toasts),
    showToast,
  }
}
