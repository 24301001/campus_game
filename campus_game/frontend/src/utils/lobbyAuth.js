// The lobby owns the only login form. The coding platform receives a scoped
// ticket from that session and never asks for another password.
export async function ensureAgentTicket() {
  const lobbyToken = localStorage.getItem('mpToken')
  if (!lobbyToken) return false
  try {
    const response = await fetch('/api/mp/npc/agent', {
      method: 'POST',
      headers: { Authorization: `Bearer ${lobbyToken}`, 'Content-Type': 'application/json' },
      body: '{}'
    })
    if (!response.ok) return false
    const ticket = await response.json()
    if (!ticket.user?.token) return false
    const { useUserStore } = await import('@/stores/user')
    const store = useUserStore()
    store.setToken(ticket.user.token)
    store.setUser({
      id: ticket.user.userId,
      username: ticket.user.username,
      nickname: localStorage.getItem('mpNickname') || ticket.user.nickname,
      role: ticket.user.role
    })
    return true
  } catch (_) {
    return false
  }
}
