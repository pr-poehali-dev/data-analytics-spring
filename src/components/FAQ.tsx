import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Как записаться на процедуру?",
    answer:
      "Запись доступна онлайн на сайте круглосуточно — выберите услугу, мастера, удобную дату и время. Также можно записаться по телефону или прийти лично в любой из наших салонов.",
  },
  {
    question: "Нужна ли консультация перед процедурой?",
    answer:
      "Для большинства косметологических процедур — да. Наш специалист проводит бесплатную экспресс-консультацию перед первым визитом, чтобы подобрать оптимальный курс ухода под ваш тип кожи и задачи.",
  },
  {
    question: "Какую косметику вы используете?",
    answer:
      "Мы работаем только с профессиональными сертифицированными брендами: премиальные линейки с доказанной эффективностью. Всю используемую косметику можно приобрести у нас в магазине для домашнего ухода.",
  },
  {
    question: "Есть ли противопоказания для процедур?",
    answer:
      "Некоторые процедуры имеют противопоказания. На консультации мастер подробно расскажет об ограничениях и подберёт альтернативу, если это необходимо. Ваша безопасность — наш приоритет.",
  },
  {
    question: "Можно ли отменить или перенести запись?",
    answer:
      "Да, отменить или перенести запись можно через сайт или по телефону не позднее чем за 2 часа до начала процедуры. Мы всегда стараемся найти удобное решение для клиента.",
  },
  {
    question: "Как найти ближайший салон MagicShine?",
    answer:
      "Все наши адреса и режим работы указаны на сайте с картой. Выберите ближайшую локацию и постройте маршрут прямо из браузера.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Вопросы</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Частые вопросы
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}