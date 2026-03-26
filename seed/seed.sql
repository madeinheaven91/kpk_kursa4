-- ============================================================
--  СОТРУДНИКИ
-- ============================================================
INSERT INTO employees (account_login, name, phone) VALUES
  ('ivanov_a',     'Иванов Алексей Сергеевич',     '+7 (843) 201-11-01'),
  ('petrova_m',    'Петрова Мария Владимировна',    '+7 (843) 201-11-02'),
  ('sokolov_d',    'Соколов Дмитрий Николаевич',    '+7 (843) 201-11-03'),
  ('kuznetsova_o', 'Кузнецова Ольга Игоревна',      '+7 (843) 201-11-04'),
  ('morozov_v',    'Морозов Василий Петрович',      '+7 (843) 201-11-05');

-- ============================================================
--  КЛИЕНТЫ
-- ============================================================
INSERT INTO clients (name, phone, description) VALUES
  ('Захарова Елена Павловна',    '+7 (917) 301-22-11', 'Частный клиент, дочке 5 лет, любит принцесс'),
  ('Громов Игорь Анатольевич',   '+7 (917) 302-33-22', 'Частный клиент, сын 7 лет, увлекается супергероями'),
  ('Федорова Анна Михайловна',   '+7 (917) 303-44-33', 'Частный клиент, двое детей, 4 и 6 лет'),
  ('ООО «Казань-Ивент»',         '+7 (843) 400-55-44', 'Корпоративный клиент, организует праздники в детских садах и школах'),
  ('Сидорова Наталья Юрьевна',   '+7 (917) 305-66-55', 'Частный клиент, сын 3 года, первый большой праздник'),
  ('Николаев Павел Андреевич',   '+7 (917) 306-77-66', 'Частный клиент, дочка 8 лет, любит единорогов и магию');

-- ============================================================
--  ЗАКАЗЫ + НАЗНАЧЕНИЯ СОТРУДНИКОВ
--  duration — в часах (дробные значения разрешены: 1.5, 2.5 …)
-- ============================================================

-- ── 03.09.2025  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-09-03 11:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'День рождения 5 лет. Костюм Золушки, машина с мыльными пузырями, шарики',
   7500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-09-03 11:00' AND o.address='г. Казань, ул. Баумана, д. 14, кв. 7';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2025-09-03 13:00', 1.5,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Праздник супергероев. Костюм Человека-паука, квест по квартире, светящийся реквизит',
   6500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-09-03 13:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2025-09-03 16:00', 2,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'День рождения 3 года. Костюм Клоуна, шарики, подарочная фотосессия',
   6000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-09-03 16:00';

-- ── 10.09.2025  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-09-10 10:00', 3,
   'г. Казань, ул. Декабристов, д. 2 (детский сад №45)',
   'Праздник знаний. Костюмы Буратино и Мальвины, сценарий на 25 детей',
   18000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-09-10 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-09-10 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2025-09-10 15:00', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'День рождения 8 лет. Костюм Единорога, аквагрим, фокусник',
   9000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-09-10 15:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Фокусник' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-09-10 15:00';

-- ── 20.09.2025  1 заказ ─────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2025-09-20 12:00', 2.5,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Совместный праздник 4 и 6 лет. Костюмы Феи и Дракончика, аквагрим, настольные игры',
   8500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-09-20 12:00';

-- ── 27.09.2025  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-09-27 11:00', 1.5,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Мини-спектакль «Золушка». Реквизит: карета, туфелька, конфетти',
   5500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-09-27 11:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-09-27 13:00', 3,
   'г. Казань, ул. Николая Ершова, д. 1А (школа №123)',
   'Праздник в начальной школе. Костюмы сказочных персонажей, конкурсы, КВН, 40 детей',
   22000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-09-27 13:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-09-27 13:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-09-27 13:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2025-09-27 17:00', 2,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Тематическая вечеринка «Дино». Костюм Тираннозавра, игры, торт с динозаврами',
   7000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-09-27 17:00';

-- ── 04.10.2025  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2025-10-04 12:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Квест «Сокровища пиратов». Карта, сундук с реквизитом, костюм Капитана',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-10-04 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2025-10-04 15:00', 2.5,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Шоу мыльных пузырей + аквагрим. Машина с пузырями, костюм волшебника',
   9500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-10-04 15:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Техник' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-10-04 15:00';

-- ── 15.10.2025  1 заказ ─────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-10-15 10:00', 4,
   'г. Казань, ул. Петербургская, д. 52 (ТЦ «Южный», игровая зона)',
   'Хэллоуин-вечеринка для детей. Костюмы монстров (6 шт.), грим, страшные конкурсы, 50 детей',
   35000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-10-15 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-10-15 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-10-15 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-10-15 10:00';

-- ── 25.10.2025  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-10-25 12:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Праздник «Фиксики». Костюм Нолика, интерактивные опыты, игры для детей',
   7500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-10-25 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2025-10-25 15:00', 1.5,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Мини-праздник «Мимимишки». Мягкие игрушки, костюм Кеши, конкурсы для малышей',
   5000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-10-25 15:00';

-- ── 05.11.2025  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2025-11-05 11:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'День рождения «Трансформеры». Костюм Оптимуса, квест, светящийся реквизит',
   9000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-11-05 11:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2025-11-05 13:30', 2,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Осенний праздник. Костюм Лесной Феи, поделки из природных материалов, хоровод',
   6500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-11-05 13:30';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-11-05 16:00', 2.5,
   'г. Казань, ул. Декабристов, д. 2 (детский сад №45)',
   'День матери в детском саду. Сценарий с подарками мамам, конкурсы, 20 детей',
   12000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-11-05 16:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-11-05 16:00';

-- ── 19.11.2025  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2025-11-19 12:00', 3,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Магическое шоу. Фокусник, костюм Гарри Поттера, живые кролики, 15 гостей',
   14000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-11-19 12:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-11-19 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-11-19 16:00', 1.5,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Тематическая фотосессия «Принцессы». Костюм Авроры, декор, реквизит',
   5500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-11-19 16:00';

-- ── 29.11.2025  4 заказа (загруженный день) ─────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-11-29 09:00', 3,
   'г. Казань, ул. Николая Ершова, д. 1А (школа №123)',
   'КВН на осенних каникулах. Костюмы Смешариков (4 шт.), командные конкурсы, 35 детей',
   25000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-11-29 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-11-29 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-11-29 09:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2025-11-29 12:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Праздник «Лего». Костюм Лего-человечка, конструкторские конкурсы, призы',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-11-29 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2025-11-29 14:00', 2,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Праздник «Холодное сердце». Костюм Эльзы, ледяная дискотека, шарики',
   9000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-11-29 14:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2025-11-29 17:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Мини-праздник «Три кота». Костюм Карамельки, угощения, сюрпризная коробка',
   5500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-11-29 17:00';

-- ── 10.12.2025  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-12-10 10:00', 4,
   'г. Казань, ул. Петербургская, д. 52 (ТЦ «Южный», игровая зона)',
   'Новогоднее представление. Костюмы Деда Мороза и Снегурочки, ёлка, подарки, 60 детей',
   45000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-12-10 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-12-10 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-12-10 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2025-12-10 16:00', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Мастер-класс «Письмо Деду Морозу». Украшение конвертов, роспись игрушек, сладкий стол',
   7000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-12-10 16:00';

-- ── 20.12.2025  4 заказа (предновогодний ажиотаж) ───────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-12-20 10:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Визит Деда Мороза. Стихи, мешок с сюрпризами, костюм Снегурочки для помощницы',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-12-20 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2025-12-20 12:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Новогодний праздник. Костюм Деда Мороза и Снеговика, хоровод, подарки',
   9500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-12-20 12:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-12-20 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2025-12-20 14:30', 2.5,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Сказка «Морозко». Костюм Снегурочки и Лисы, живая ёлка, подарки двум детям',
   11000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-12-20 14:30';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-12-20 14:30';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2025-12-20 17:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Первый визит Деда Мороза. Мешок с подарками, стишок, фото, костюм Зайца для малыша',
   7000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-12-20 17:00';

-- ── 25.12.2025  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2025-12-25 10:00', 4,
   'г. Казань, ул. Декабристов, д. 2 (детский сад №45)',
   'Новогодний утренник. Костюмы Деда Мороза, Снегурочки и трёх персонажей, 30 детей',
   30000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2025-12-25 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2025-12-25 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2025-12-25 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-12-25 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2025-12-25 15:00', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Вечеринка «Единороги и волшебство». Костюм Единорога, блёстки, торт',
   10000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2025-12-25 15:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2025-12-25 17:00', 1.5,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Новогодняя сказка дома. Дед Мороз с мешком, танцы вокруг ёлки',
   7500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2025-12-25 17:00';

-- ── 07.01.2026  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2026-01-07 12:00', 2,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Рождественский праздник. Костюм Снеговика, кукольный театр, горячий шоколад',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-01-07 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2026-01-07 15:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Рождественский квест. Костюм Ангела, поиск подарков по подсказкам, сладкий приз',
   8500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-01-07 15:00';

-- ── 14.01.2026  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-01-14 10:00', 3,
   'г. Казань, ул. Николая Ершова, д. 1А (школа №123)',
   'Старый Новый год в школе. Костюмы Деда Мороза и Снегурочки, конкурсы, подарки, 45 детей',
   28000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Дед Мороз' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-01-14 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-01-14 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-01-14 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2026-01-14 14:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Старый Новый год дома. Костюм Снегурочки, игры, конфетти, подарочная упаковка',
   6000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Снегурочка' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-01-14 14:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2026-01-14 17:00', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Праздник «Гравити Фолс». Костюм Диппера, головоломки, наклейки, атрибутика',
   9000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-01-14 17:00';

-- ── 31.01.2026  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2026-01-31 12:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Праздник «Барби». Розовый декор, костюм Барби, мастер-класс по причёскам',
   8500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-01-31 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-01-31 15:00', 3,
   'г. Казань, ул. Декабристов, д. 2 (детский сад №45)',
   'Зимний утренник. Конкурс снежинок, костюмы зимних персонажей, 25 детей',
   16000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-01-31 15:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-01-31 15:00';

-- ── 14.02.2026  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2026-02-14 12:00', 2,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'День всех влюблённых для детей. Костюм Купидона, открытки своими руками, сердечки',
   7000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-02-14 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2026-02-14 15:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Вечеринка «Мишки Гамми». Костюм Гамми, прыгалки, сладкий стол, цветные шарики',
   5500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-02-14 15:00';

-- ── 21.02.2026  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2026-02-21 11:00', 2.5,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Праздник защитника. Военный квест, костюм солдата, эстафеты, медали победителям',
   9500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-02-21 11:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-02-21 13:00', 3,
   'г. Казань, ул. Николая Ершова, д. 1А (школа №123)',
   'День защитника в школе. Конкурсы для мальчиков, грамоты, костюмы военных, 30 детей',
   18000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-02-21 13:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-02-21 13:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2026-02-21 16:00', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Пейнтбол-пати для детей. Безопасные пистолеты, маски, командная игра, 10 детей',
   11000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-02-21 16:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Техник' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-02-21 16:00';

-- ── 07.03.2026  4 заказа (предпраздничный день) ─────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-03-07 09:00', 4,
   'г. Казань, ул. Петербургская, д. 52 (ТЦ «Южный», игровая зона)',
   'Праздник 8 марта. Костюмы Весны и Цветочницы, мастер-класс по букетам, 50 детей',
   38000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-03-07 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-03-07 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-03-07 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-03-07 09:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2026-03-07 11:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Праздник для девочек «Принцессы». Костюм Белль, чаепитие, мастер-класс по украшениям',
   9000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-03-07 11:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2026-03-07 14:00', 2.5,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Двойной праздник «8 марта». Костюмы Рапунцель и Тианы, плетение кос, торт с цветами',
   12000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-03-07 14:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-03-07 14:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2026-03-07 17:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Весенний сюрприз. Костюм Пчёлки, цветочный декор, угощения, фотозона',
   6500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-03-07 17:00';

-- ── 18.03.2026  2 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2026-03-18 12:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Праздник «Minecraft». Костюм Стива, пиксельный декор, конкурсы, пиньята',
   9500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-03-18 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2026-03-18 15:00', 2.5,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Научная вечеринка. Костюм профессора, опыты с вулканом и слаймом, дипломы юного учёного',
   11000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-03-18 15:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Техник' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-03-18 15:00';

-- ── 28.03.2026  3 заказа ────────────────────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-03-28 10:00', 4,
   'г. Казань, ул. Декабристов, д. 2 (детский сад №45)',
   'Весенний утренник. Костюмы Весны, Солнышка и Дождика, сценарий, 30 детей',
   22000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-03-28 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-03-28 10:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-03-28 10:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Захарова Елена Павловна'),
   '2026-03-28 13:00', 2,
   'г. Казань, ул. Баумана, д. 14, кв. 7',
   'Праздник «Русалочка». Костюм Ариэль, перламутровый декор, шарики, кукла в подарок',
   8500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-03-28 13:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Федорова Анна Михайловна'),
   '2026-03-28 16:00', 2,
   'г. Казань, ул. Ершова, д. 20, кв. 3',
   'Уличный праздник на веранде. Костюм Зайца, эстафеты, машина с мыльными пузырями',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-03-28 16:00';

-- ── 01.04.2026  4 заказа (день смеха) ───────────────────────
INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'ООО «Казань-Ивент»'),
   '2026-04-01 09:00', 3,
   'г. Казань, ул. Николая Ершова, д. 1А (школа №123)',
   'День смеха в школе. Костюмы Клоунов (3 шт.), фокусы, конкурсы розыгрышей, 50 детей',
   24000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Ведущий' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-04-01 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-04-01 09:00';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='sokolov_d' AND o.datetime='2026-04-01 09:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Сидорова Наталья Юрьевна'),
   '2026-04-01 12:00', 1.5,
   'г. Казань, ул. Чистопольская, д. 5, кв. 38',
   'Шуточный праздник «1 апреля». Костюм Скомороха, конкурсы-розыгрыши, смешные призы',
   6000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='kuznetsova_o' AND o.datetime='2026-04-01 12:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Громов Игорь Анатольевич'),
   '2026-04-01 14:00', 2,
   'г. Казань, пр. Победы, д. 32, кв. 15',
   'Праздник «Смешарики». Костюм Кроша, конкурсы, большой мяч, командные игры',
   8000.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='morozov_v' AND o.datetime='2026-04-01 14:00';

INSERT INTO orders (client_id, datetime, duration, address, description, price) VALUES
  ((SELECT id FROM clients WHERE name = 'Николаев Павел Андреевич'),
   '2026-04-01 16:30', 2,
   'г. Казань, ул. Карла Маркса, д. 51, кв. 12',
   'Квест «Апрельский сюрприз». Костюм Детектива, шуточные улики, загадки, медаль победителю',
   9500.00);
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='ivanov_a' AND o.datetime='2026-04-01 16:30';
INSERT INTO employee_orders (employee_id, order_id, role)
  SELECT e.id, o.id, 'Аниматор' FROM employees e, orders o
  WHERE e.account_login='petrova_m' AND o.datetime='2026-04-01 16:30';
