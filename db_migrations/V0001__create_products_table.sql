CREATE TABLE t_p74084546_garden_shop_online.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  badge VARCHAR(50),
  icon VARCHAR(50) DEFAULT 'Leaf',
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p74084546_garden_shop_online.products (name, description, price, badge, icon, sort_order) VALUES
('БиоЩит Универсальный', 'Защита от 95% вредителей. Безопасен для пчёл и почвы.', 890, 'Хит', 'Leaf', 1),
('АкваФунгицид', 'Водный раствор от грибковых заболеваний растений.', 1250, 'Новинка', 'Droplets', 2),
('Сетка антиград 4×6м', 'Защита теплицы и грядок от града и птиц.', 2100, NULL, 'Grid3x3', 3),
('Феромонные ловушки', 'Привлекают и уничтожают насекомых-вредителей.', 450, NULL, 'Bug', 4),
('МикроКорм Почвы', 'Восстанавливает баланс микрофлоры после обработки.', 680, NULL, 'Sprout', 5),
('ЗащитаПлюс Набор', 'Комплект для полного сезона: 4 средства + инструкция.', 3400, 'Выгодно', 'Package', 6);
