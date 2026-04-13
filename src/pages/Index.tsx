import { useState } from "react";
import Icon from "@/components/ui/icon";

type IName = string;

const HERO_IMAGE = "https://cdn.poehali.dev/projects/0a6051c2-e102-4c4c-9442-b643b6041a58/files/4b4b59d1-f472-46bc-81e8-501ed326c05c.jpg";
const PRODUCTS_IMAGE = "https://cdn.poehali.dev/projects/0a6051c2-e102-4c4c-9442-b643b6041a58/files/80dfeb7e-dedc-41b7-888c-d3da0ea38a4c.jpg";

const NAV_LINKS = [
  { label: "Главная", href: "home" },
  { label: "Каталог", href: "catalog" },
  { label: "О товарах", href: "about" },
  { label: "Доставка", href: "delivery" },
  { label: "Отзывы", href: "reviews" },
  { label: "Контакты", href: "contacts" },
];

const PRODUCTS = [
  { id: 1, name: "БиоЩит Универсальный", desc: "Защита от 95% вредителей. Безопасен для пчёл и почвы.", price: "890 ₽", badge: "Хит", icon: "Leaf" },
  { id: 2, name: "АкваФунгицид", desc: "Водный раствор от грибковых заболеваний растений.", price: "1 250 ₽", badge: "Новинка", icon: "Droplets" },
  { id: 3, name: "Сетка антиград 4×6м", desc: "Защита теплицы и грядок от града и птиц.", price: "2 100 ₽", badge: null, icon: "Grid3x3" },
  { id: 4, name: "Феромонные ловушки", desc: "Привлекают и уничтожают насекомых-вредителей.", price: "450 ₽", badge: null, icon: "Bug" },
  { id: 5, name: "МикроКорм Почвы", desc: "Восстанавливает баланс микрофлоры после обработки.", price: "680 ₽", badge: null, icon: "Sprout" },
  { id: 6, name: "ЗащитаПлюс Набор", desc: "Комплект для полного сезона: 4 средства + инструкция.", price: "3 400 ₽", badge: "Выгодно", icon: "Package" },
];

const REVIEWS = [
  { name: "Марина К.", city: "Краснодар", text: "Пользуюсь БиоЩитом второй сезон — урожай помидоров вырос в два раза! Никакой химии, только природные компоненты.", stars: 5 },
  { name: "Владимир Д.", city: "Воронеж", text: "Заказал набор для дачи — всё пришло в упаковке, быстро. Сетка антиград спасла теплицу во время июльского шторма.", stars: 5 },
  { name: "Елена С.", city: "Ростов-на-Дону", text: "Консультант помог выбрать средство от белокрылки — уже через неделю результат заметен. Рекомендую магазин всем соседям.", stars: 5 },
];

const DELIVERY_STEPS = [
  { icon: "ShoppingCart", title: "Оформляете заказ", desc: "Онлайн или по телефону — как удобно" },
  { icon: "Package", title: "Собираем посылку", desc: "В течение 1 рабочего дня" },
  { icon: "Truck", title: "Доставляем", desc: "СДЭК, Почта России или курьер по городу" },
  { icon: "Home", title: "Получаете", desc: "2–7 дней в зависимости от региона" },
];

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Привет! Я помогу подобрать средство защиты для вашего сада 🌿 Расскажите, какая проблема вас беспокоит?" }
  ]);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = { from: "user", text: chatMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setChatMessage("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: "bot",
        text: "Спасибо за вопрос! Наш специалист ответит в ближайшие несколько минут. Также можете позвонить: +7 (800) 123-45-67"
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-body overflow-x-hidden">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(45,30%,97%,0.96)] backdrop-blur-sm border-b border-[hsl(var(--border))] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--forest))] flex items-center justify-center">
              <Icon name="Leaf" size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-[hsl(var(--forest))]">СадЩит</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--forest))]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+78001234567" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--forest))] hover:opacity-80 transition-opacity">
              <Icon name="Phone" size={15} />
              8 800 123-45-67
            </a>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(45,30%,97%)] border-t border-[hsl(var(--border))] px-4 py-3 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href)} className="text-left text-sm font-medium py-1 text-[hsl(var(--foreground))] hover:text-[hsl(var(--forest))] transition-colors">
                {link.label}
              </button>
            ))}
            <a href="tel:+78001234567" className="text-sm font-medium text-[hsl(var(--forest))] py-1">8 800 123-45-67</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Сад" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,40,15,0.78)] via-[rgba(20,60,20,0.5)] to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white/90 text-sm font-medium">Натуральные средства защиты</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Ваш сад<br />под надёжной<br />
              <em className="text-green-300 not-italic">защитой</em>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Эко-средства против вредителей и болезней растений. Безопасно для почвы, пчёл и вашего урожая.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("catalog")}
                className="bg-[hsl(138,40%,28%)] hover:bg-[hsl(138,30%,38%)] text-white px-8 py-3.5 rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/40 px-8 py-3.5 rounded-full font-medium transition-all duration-200"
              >
                Консультация
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-white/60" />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[hsl(138,40%,28%)] py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { val: "1 200+", label: "товаров в каталоге" },
            { val: "8 лет", label: "на рынке защиты сада" },
            { val: "45 000", label: "довольных клиентов" },
            { val: "100%", label: "эко-состав" },
          ].map(s => (
            <div key={s.label}>
              <div className="font-display text-4xl font-bold text-green-200">{s.val}</div>
              <div className="text-white/70 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[hsl(90,35%,38%)] text-sm font-medium uppercase tracking-widest mb-2">Ассортимент</p>
          <h2 className="font-display text-5xl font-bold text-[hsl(25,25%,22%)]">Каталог товаров</h2>
          <div className="mt-4 w-40 mx-auto h-px bg-gradient-to-r from-transparent via-[hsl(138,40%,28%)] to-transparent opacity-40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="group bg-white rounded-2xl border border-[hsl(var(--border))] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {p.badge && (
                <span className="absolute top-4 right-4 bg-[hsl(138,40%,28%)] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-[hsl(90,25%,88%)] flex items-center justify-center mb-4 group-hover:bg-[hsl(138,40%,28%)] transition-colors">
                <Icon name={p.icon as IName} size={24} className="text-[hsl(138,40%,28%)] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[hsl(25,25%,22%)] mb-2">{p.name}</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold text-[hsl(138,40%,28%)]">{p.price}</span>
                <button className="bg-[hsl(138,40%,28%)] hover:bg-[hsl(138,30%,38%)] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT PRODUCTS */}
      <section id="about" className="bg-[hsl(90,25%,88%,0.35)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[hsl(90,35%,38%)] text-sm font-medium uppercase tracking-widest mb-2">О товарах</p>
              <h2 className="font-display text-5xl font-bold text-[hsl(25,25%,22%)] mb-6">Природные компоненты — главная ценность</h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
                Все средства в нашем каталоге проходят проверку на экологическую безопасность. Мы работаем только с производителями, которые используют натуральные активные вещества: экстракты трав, биологические агенты, минеральные компоненты.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "ShieldCheck", title: "Сертифицировано", desc: "Все товары имеют сертификат качества и разрешены к применению" },
                  { icon: "Leaf", title: "Эко-состав", desc: "Без токсичной химии — безопасно для детей и домашних животных" },
                  { icon: "Sprout", title: "Результат виден", desc: "Первый эффект — уже через 3–5 дней после применения" },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(138,40%,28%)] flex items-center justify-center flex-shrink-0">
                      <Icon name={f.icon as IName} size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[hsl(25,25%,22%)]">{f.title}</div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={PRODUCTS_IMAGE} alt="Товары для сада" className="rounded-3xl shadow-2xl w-full object-cover aspect-square" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="Star" size={18} className="text-yellow-500" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[hsl(25,25%,22%)]">Рейтинг 4.9</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">по 2400 отзывам</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[hsl(90,35%,38%)] text-sm font-medium uppercase tracking-widest mb-2">Логистика</p>
          <h2 className="font-display text-5xl font-bold text-[hsl(25,25%,22%)]">Доставка по всей России</h2>
          <div className="mt-4 w-40 mx-auto h-px bg-gradient-to-r from-transparent via-[hsl(138,40%,28%)] to-transparent opacity-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {DELIVERY_STEPS.map((step, i) => (
            <div key={step.title} className="text-center relative">
              {i < DELIVERY_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-[hsl(var(--border))] z-0" />
              )}
              <div className="relative z-10 w-12 h-12 rounded-full bg-[hsl(138,40%,28%)] flex items-center justify-center mx-auto mb-4 shadow-md">
                <Icon name={step.icon as IName} size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-[hsl(25,25%,22%)] mb-1">{step.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "Truck", title: "СДЭК и Почта России", desc: "Доставка в любую точку страны. Отслеживание заказа в реальном времени." },
            { icon: "MapPin", title: "Самовывоз", desc: "Из наших пунктов выдачи в Краснодаре, Ростове и Воронеже." },
            { icon: "Gift", title: "Бесплатно от 3 000 ₽", desc: "При заказе от 3 000 рублей — доставка за наш счёт по всей России." },
          ].map(d => (
            <div key={d.title} className="bg-[hsl(90,25%,88%,0.4)] rounded-2xl p-6 border border-[hsl(var(--border))]">
              <Icon name={d.icon as IName} size={24} className="text-[hsl(138,40%,28%)] mb-3" />
              <h3 className="font-semibold text-[hsl(25,25%,22%)] mb-2">{d.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-[hsl(25,25%,22%)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-400 text-sm font-medium uppercase tracking-widest mb-2">Клиенты</p>
            <h2 className="font-display text-5xl font-bold text-white">Отзывы садоводов</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-5 font-display text-lg italic">«{r.text}»</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(138,40%,28%)] flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{r.name}</div>
                    <div className="text-white/50 text-xs">{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-[hsl(90,35%,38%)] text-sm font-medium uppercase tracking-widest mb-2">Связь</p>
            <h2 className="font-display text-5xl font-bold text-[hsl(25,25%,22%)] mb-6">Напишите нам</h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
              Есть вопросы по товарам, доставке или хотите получить консультацию агронома? Мы ответим в течение 2 часов.
            </p>
            <div className="space-y-4">
              {[
                { icon: "Phone", label: "Телефон", val: "8 800 123-45-67 (бесплатно)" },
                { icon: "Mail", label: "Email", val: "info@sadshit.ru" },
                { icon: "Clock", label: "Режим работы", val: "Пн–Сб, 9:00–19:00" },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(90,25%,88%)] flex items-center justify-center">
                    <Icon name={c.icon as IName} size={18} className="text-[hsl(138,40%,28%)]" />
                  </div>
                  <div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">{c.label}</div>
                    <div className="font-medium text-[hsl(25,25%,22%)]">{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="bg-white border border-[hsl(var(--border))] rounded-3xl p-8 shadow-sm">
            <h3 className="font-display text-2xl font-semibold text-[hsl(25,25%,22%)] mb-6">Оставить заявку</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Ваше имя</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Иван Петров"
                  className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)] bg-[hsl(var(--background))]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Телефон</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)] bg-[hsl(var(--background))]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Сообщение</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  rows={3}
                  placeholder="Опишите вашу проблему или вопрос..."
                  className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)] bg-[hsl(var(--background))] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[hsl(138,40%,28%)] hover:bg-[hsl(138,30%,38%)] text-white py-3.5 rounded-xl font-medium transition-colors"
              >
                Отправить заявку
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[hsl(25,25%,22%)] text-white/60 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[hsl(138,40%,28%)] flex items-center justify-center">
              <Icon name="Leaf" size={14} className="text-white" />
            </div>
            <span className="font-display text-lg text-white/80">СадЩит</span>
          </div>
          <p className="text-sm">© 2024 СадЩит — защита вашего сада</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {NAV_LINKS.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-xs hover:text-white transition-colors">
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-[hsl(var(--border))] w-80 overflow-hidden">
            <div className="bg-[hsl(138,40%,28%)] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="MessageCircle" size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Онлайн-консультант</div>
                  <div className="text-green-200 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block"></span>
                    На связи
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="h-56 overflow-y-auto p-3 space-y-2 bg-[hsl(var(--background))]">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.from === "user"
                      ? "bg-[hsl(138,40%,28%)] text-white rounded-br-sm"
                      : "bg-white border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[hsl(var(--border))] flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Напишите вопрос..."
                className="flex-1 border border-[hsl(var(--border))] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)] bg-[hsl(var(--background))]"
              />
              <button onClick={sendMessage} className="w-9 h-9 rounded-xl bg-[hsl(138,40%,28%)] flex items-center justify-center hover:bg-[hsl(138,30%,38%)] transition-colors flex-shrink-0">
                <Icon name="Send" size={15} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(v => !v)}
          className="w-14 h-14 rounded-full bg-[hsl(138,40%,28%)] shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 animate-float"
        >
          <Icon name={chatOpen ? "X" : "MessageCircle"} size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}