import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const ADMIN_URL = "https://functions.poehali.dev/bba49d80-1c6e-4035-b48e-8ad1082f69fe"

interface Booking {
  id: number
  name: string
  phone: string
  service: string
  salon: string
  comment: string
  created_at: string
}

export default function Admin() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("")

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(ADMIN_URL, {
        headers: { "X-Admin-Password": password },
      })
      if (res.status === 401) {
        setError("Неверный пароль")
        setLoading(false)
        return
      }
      const raw = await res.json()
      const data = typeof raw === "string" ? JSON.parse(raw) : raw
      setBookings(data.bookings || [])
      setAuthed(true)
    } catch {
      setError("Ошибка подключения")
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch(ADMIN_URL, {
        headers: { "X-Admin-Password": password },
      })
      const raw = await res.json()
      const data = typeof raw === "string" ? JSON.parse(raw) : raw
      setBookings(data.bookings || [])
    } finally {
      setLoading(false)
    }
  }

  const filtered = bookings.filter((b) =>
    filter === "" ||
    b.name.toLowerCase().includes(filter.toLowerCase()) ||
    b.phone.includes(filter) ||
    b.service.toLowerCase().includes(filter.toLowerCase()) ||
    b.salon.toLowerCase().includes(filter.toLowerCase())
  )

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-medium mb-2">MagicShine</h1>
            <p className="text-muted-foreground text-sm">Панель администратора</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-primary-foreground px-4 py-3 text-sm hover:bg-foreground/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={18} />
          </a>
          <h1 className="font-medium">MagicShine — Заявки</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{bookings.length} заявок</span>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 text-sm border border-border px-4 py-2 hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <Icon name="RefreshCw" size={14} />
            Обновить
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Всего заявок", value: bookings.length, icon: "ClipboardList" },
            { label: "Чистка лица", value: bookings.filter(b => b.service === "Чистка лица").length, icon: "Sparkles" },
            { label: "Стара-Загора 140", value: bookings.filter(b => b.salon.includes("Стара-Загора")).length, icon: "MapPin" },
            { label: "Ново-Садовая 44", value: bookings.filter(b => b.salon.includes("Ново-Садовая")).length, icon: "MapPin" },
          ].map((stat) => (
            <div key={stat.label} className="border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={stat.icon as "MapPin"} size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-3xl font-medium">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Поиск по имени, телефону, услуге..."
            className="w-full max-w-sm border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Inbox" size={40} className="mx-auto mb-4 opacity-30" />
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Дата</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Клиент</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Телефон</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Услуга</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Салон</th>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b.id} className={`border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{b.created_at}</td>
                    <td className="px-5 py-4 font-medium whitespace-nowrap">{b.name}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <a href={`tel:${b.phone}`} className="hover:underline">{b.phone}</a>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-pink-50 text-pink-700 px-2 py-1 text-xs rounded">{b.service}</span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{b.salon}</td>
                    <td className="px-5 py-4 text-muted-foreground max-w-[200px] truncate">{b.comment || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
