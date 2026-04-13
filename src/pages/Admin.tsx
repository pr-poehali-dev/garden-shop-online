import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/b74f91bc-22a6-47bd-9cc0-174ffbb5bd8d";

const ICONS = ["Leaf", "Droplets", "Grid3x3", "Bug", "Sprout", "Package", "ShieldCheck", "Flower", "TreePine", "Shovel", "Scissors", "FlaskConical"];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  icon: string;
  active: boolean;
  sort_order: number;
}

const EMPTY: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  badge: "",
  icon: "Leaf",
  active: true,
  sort_order: 0,
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = () => {
    setLoading(true);
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setProducts(parsed.products || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, badge: p.badge || "", icon: p.icon, active: p.active, sort_order: p.sort_order });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const body = { ...form, badge: form.badge?.trim() || null, price: Number(form.price) };
    if (editingId !== null) {
      await fetch(`${API_URL}/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      showToast("Товар обновлён");
    } else {
      await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      showToast("Товар добавлен");
    }
    setSaving(false);
    setShowForm(false);
    loadProducts();
  };

  const remove = async (id: number, name: string) => {
    if (!confirm(`Удалить товар «${name}»?`)) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    showToast("Товар удалён");
    loadProducts();
  };

  const toggleActive = async (p: Product) => {
    await fetch(`${API_URL}/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, badge: p.badge || null, active: !p.active }),
    });
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] font-body">
      {/* Header */}
      <header className="bg-[hsl(138,40%,28%)] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <a href="/" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <Icon name="ArrowLeft" size={16} className="text-white" />
          </a>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Icon name="Leaf" size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold">СадЩит — Админ-панель</div>
            <div className="text-green-200 text-xs">Управление каталогом товаров</div>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-white text-[hsl(138,40%,28%)] px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
        >
          <Icon name="Plus" size={16} />
          Добавить товар
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 text-center">
            <div className="font-display text-3xl font-bold text-[hsl(138,40%,28%)]">{products.length}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Всего товаров</div>
          </div>
          <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 text-center">
            <div className="font-display text-3xl font-bold text-[hsl(138,40%,28%)]">{products.filter(p => p.active).length}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Активных</div>
          </div>
          <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-4 text-center">
            <div className="font-display text-3xl font-bold text-[hsl(138,40%,28%)]">{products.filter(p => !p.active).length}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Скрытых</div>
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
          <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[hsl(25,25%,22%)]">Список товаров</h2>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">{products.length} позиций</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[hsl(var(--muted-foreground))]">
              <div className="w-8 h-8 border-2 border-[hsl(138,40%,28%)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Загружаю товары...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-[hsl(var(--muted-foreground))]">
              <Icon name="Package" size={40} className="mx-auto mb-3 opacity-30" />
              <p className="mb-4">Товаров пока нет</p>
              <button onClick={openNew} className="bg-[hsl(138,40%,28%)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[hsl(138,30%,38%)] transition-colors">
                Добавить первый товар
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[hsl(var(--border))]">
              {products.map(p => (
                <div key={p.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-[hsl(45,30%,97%)] transition-colors ${!p.active ? "opacity-50" : ""}`}>
                  <div className="w-10 h-10 rounded-xl bg-[hsl(90,25%,88%)] flex items-center justify-center flex-shrink-0">
                    <Icon name={p.icon} size={20} className="text-[hsl(138,40%,28%)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[hsl(25,25%,22%)] truncate">{p.name}</span>
                      {p.badge && (
                        <span className="bg-[hsl(138,40%,28%)] text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">{p.badge}</span>
                      )}
                      {!p.active && (
                        <span className="bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full flex-shrink-0">скрыт</span>
                      )}
                    </div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))] truncate">{p.description}</div>
                  </div>
                  <div className="font-display text-lg font-bold text-[hsl(138,40%,28%)] flex-shrink-0">
                    {p.price.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(p)}
                      title={p.active ? "Скрыть" : "Показать"}
                      className="w-8 h-8 rounded-lg hover:bg-[hsl(90,25%,88%)] flex items-center justify-center transition-colors"
                    >
                      <Icon name={p.active ? "Eye" : "EyeOff"} size={16} className="text-[hsl(var(--muted-foreground))]" />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      title="Редактировать"
                      className="w-8 h-8 rounded-lg hover:bg-[hsl(90,25%,88%)] flex items-center justify-center transition-colors"
                    >
                      <Icon name="Pencil" size={16} className="text-[hsl(138,40%,28%)]" />
                    </button>
                    <button
                      onClick={() => remove(p.id, p.name)}
                      title="Удалить"
                      className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <Icon name="Trash2" size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 pt-6 pb-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-[hsl(25,25%,22%)]">
                {editingId !== null ? "Редактировать товар" : "Новый товар"}
              </h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full hover:bg-[hsl(90,25%,88%)] flex items-center justify-center transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Название *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Например: БиоЩит Универсальный"
                  className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Описание</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Краткое описание товара..."
                  className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Цена (₽) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="890"
                    className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Пометка</label>
                  <input
                    value={form.badge || ""}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    placeholder="Хит, Новинка, Выгодно..."
                    className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-2">Иконка</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border-2 ${form.icon === icon ? "border-[hsl(138,40%,28%)] bg-[hsl(90,25%,88%)]" : "border-transparent hover:bg-[hsl(90,25%,88%)]"}`}
                    >
                      <Icon name={icon} size={18} className={form.icon === icon ? "text-[hsl(138,40%,28%)]" : "text-[hsl(var(--muted-foreground))]"} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[hsl(var(--foreground))] block mb-1.5">Порядок показа</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                    className="w-full border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(138,40%,28%)]"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer pb-3">
                    <div
                      onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                      className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? "bg-[hsl(138,40%,28%)]" : "bg-gray-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">Показывать на сайте</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] py-3 rounded-xl font-medium hover:bg-[hsl(45,30%,97%)] transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name.trim()}
                className="flex-1 bg-[hsl(138,40%,28%)] hover:bg-[hsl(138,30%,38%)] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
              >
                {saving ? "Сохраняю..." : editingId !== null ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[hsl(25,25%,22%)] text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
