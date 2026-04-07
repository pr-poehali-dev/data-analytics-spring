import { useState } from "react"
import Icon from "@/components/ui/icon"

const BOOKING_URL = "https://functions.poehali.dev/a8b22a16-a32a-450d-b16e-e3618d26b6a2"

const SERVICES = ["Чистка лица", "Пилинг", "Массаж", "Мезотерапия"]

const SALONS = [
  { label: "ул. Стара-Загора, 140", value: "ул. Стара-Загора 140" },
  { label: "ул. Ново-Садовая, 44", value: "ул. Ново-Садовая 44" },
]

export function Booking() {
  const [form, setForm] = useState({ name: "", phone: "", service: "", salon: "", comment: "" })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(BOOKING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const raw = await res.json()
      const data = typeof raw === "string" ? JSON.parse(raw) : raw
      if (res.ok && data.success) {
        setSuccess(true)
        setForm({ name: "", phone: "", service: "", salon: "", comment: "" })
      } else {
        setError(data.error || "Что-то пошло не так, попробуйте ещё раз")
      }
    } catch {
      setError("Ошибка соединения, попробуйте позже")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="booking" className="py-32 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — form */}
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Онлайн-запись</p>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-8">
              Запишитесь<br />на процедуру
            </h2>

            {success ? (
              <div className="flex flex-col items-start gap-4 py-10">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
                  <Icon name="CheckCircle" size={28} className="text-pink-500" />
                </div>
                <h3 className="text-2xl font-medium">Заявка принята!</h3>
                <p className="text-muted-foreground">Мы свяжемся с вами в ближайшее время для подтверждения.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Записаться ещё раз
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Имя *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Ваше имя"
                      className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">Телефон *</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+7 (000) 000-00-00"
                      className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Услуга *</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Выберите услугу</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Салон *</label>
                  <select
                    name="salon"
                    value={form.salon}
                    onChange={handleChange}
                    required
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Выберите салон</option>
                    {SALONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Комментарий</label>
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Пожелания или вопросы..."
                    rows={3}
                    className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-foreground text-primary-foreground px-8 py-4 text-sm tracking-wide hover:bg-foreground/80 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Отправляем..." : "Записаться"}
                  {!loading && <Icon name="ArrowRight" size={16} />}
                </button>
              </form>
            )}
          </div>

          {/* Right — map + addresses */}
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наши адреса</p>
            <h2 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight mb-8">
              Мы в Самаре
            </h2>

            <div className="space-y-4 mb-8">
              {[
                { address: "ул. Стара-Загора, 140", label: "Салон №1" },
                { address: "ул. Ново-Садовая, 44", label: "Салон №2" },
              ].map((loc) => (
                <div key={loc.address} className="flex items-start gap-4 p-5 border border-border bg-background">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-secondary rounded-full">
                    <Icon name="MapPin" size={18} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{loc.label}</p>
                    <p className="font-medium">Самара, {loc.address}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden border border-border">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=50.221%2C53.218&z=12&pt=50.1985%2C53.2126%2Cpm2rdm~50.2014%2C53.2059%2Cpm2rdm&l=map"
                width="100%"
                height="360"
                style={{ border: 0, display: "block" }}
                title="Карта салонов MagicShine"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
