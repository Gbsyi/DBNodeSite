-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 03 2021 г., 10:25
-- Версия сервера: 10.3.22-MariaDB
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `lager`
--

-- --------------------------------------------------------

--
-- Структура таблицы `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `camps_id` int(11) NOT NULL,
  `seasons_id` int(11) NOT NULL,
  `children_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `camps`
--

CREATE TABLE `camps` (
  `id` int(11) NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_path` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_long` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `camps`
--

INSERT INTO `camps` (`id`, `name`, `img_path`, `description`, `description_long`, `city`, `price`) VALUES
(1, 'Компактная дверь', '/img/camp.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Новосибирск', '15000'),
(2, 'Подготовка', '/img/camp.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Москва', '12300'),
(3, 'Образ', '/img/camp.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rutrum eros ac orci tincidunt elementum. Morbi nec orci euismod, malesuada massa in, finibus erat. Vivamus rhoncus dapibus mi at faucibus. Duis finibus neque in tristique rutrum. Donec euismod bibendum magna, non laoreet mauris lobortis vitae. Fusce dapibus venenatis magna eget imperdiet. Suspendisse ultricies felis vitae dui dapibus luctus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus vivamus.', 'Абаза', '2000'),
(4, 'Польза', '/img/camp.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus. ', 'Красноярск', '150000'),
(5, 'Палец', '/img/camp.jpg', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed tincidunt nisl. Nulla fringilla ornare purus in elementum. Mauris viverra lacinia ipsum, ut malesuada justo tincidunt quis. Nam venenatis velit purus, ac fermentum purus sollicitudin a. Nunc sed ultricies mi. Maecenas gravida nulla eu neque posuere varius. Ut porta, nunc eget finibus ullamcorper, lectus ante interdum ligula, sit amet finibus neque mauris sed mi. Etiam tincidunt semper turpis vitae rutrum. Quisque sit amet lectus. ', 'Челябинск', '40000'),
(6, 'Декоративный сатанист', '/img/camp.jpg', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim', 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa, enim!', 'Красноярск', '12999'),
(7, 'Чёрный ворон', '/img/camp.jpg', 'У нас ваши дети прочтут много книг. В том числе и \"В поисках тёмного Логуса\".', 'У нас ваши дети прочтут много книг. В том числе и \"В поисках тёмного Логуса\".', 'Новосибирск', '100'),
(8, 'Связь', '/img/camps/svyaz/blyat.jpg', 'Описание', 'Краткое', 'Новосибирск', '25000'),
(9, 'Облепиха чёрт побери', '/img/camps/oblepiha-chyort-poberi/index.jpg', 'Краткое', 'Описание', 'Омск', '125000'),
(10, 'Кожа о чёрт', '/img/camps/kozha-o-chyort/694cb8f96e7de6cd1594f8e195fda1c7.jpg', 'Краткое описание', 'Описание', 'Париж', '15000'),
(11, 'Истина еблысь', '/img/camps/istina-eblys/images.jpg', 'Краткое описание', 'Описание', 'Москва', '40000'),
(12, 'Один за всех вот', '/img/camps/odin-za-vseh-vot/a.jpg', 'Краткое описание', 'Описание', 'Нягань', '1'),
(13, 'Симметричный слабак', '/img/camps/simmetrichnyy-slabak/HOtWYBL0bjs.jpg', 'Краткое описание', 'Описание', 'Красноярск', '21000');

-- --------------------------------------------------------

--
-- Структура таблицы `children`
--

CREATE TABLE `children` (
  `id` int(11) NOT NULL,
  `surname` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fathers_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `contacts` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_way` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `client` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `review` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `client`, `review`, `published`) VALUES
(1, 'ААААААААААА', 'ААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААААА', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `seasons`
--

CREATE TABLE `seasons` (
  `id` int(11) NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` year(4) NOT NULL,
  `begin_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `seasons`
--

INSERT INTO `seasons` (`id`, `name`, `year`, `begin_date`, `end_date`) VALUES
(1, 'Июнь', 2021, '2021-06-01', '2021-06-22'),
(2, 'Июль', 2021, '2021-07-01', '2021-07-22'),
(3, 'Август', 2021, '2021-08-01', '2021-08-22');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_login` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_password` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `user_login`, `user_password`) VALUES
(1, 'admin', 'admin'),
(2, 'user', 'user'),
(3, 'user1', 'user1');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `camps_id` (`camps_id`),
  ADD KEY `children_id` (`children_id`),
  ADD KEY `seasons_id` (`seasons_id`);

--
-- Индексы таблицы `camps`
--
ALTER TABLE `camps`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `children`
--
ALTER TABLE `children`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `seasons`
--
ALTER TABLE `seasons`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `camps`
--
ALTER TABLE `camps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `children`
--
ALTER TABLE `children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `seasons`
--
ALTER TABLE `seasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`camps_id`) REFERENCES `camps` (`id`),
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`children_id`) REFERENCES `children` (`id`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`seasons_id`) REFERENCES `seasons` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
