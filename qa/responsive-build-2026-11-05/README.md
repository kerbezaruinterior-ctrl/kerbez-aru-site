# Отзывчивость build — 5 ноября 2026
Lenis отключён при any-pointer:coarse или maxTouchPoints>0, десктоп duration 0.9. При изменении pointer media сцена переинициализируется. Scrub <=900px 0.3, desktop 0.5; snap delay 0.05, duration min0.2 max0.45.
11 мобильных WebP 1100px подключены через picture/source srcset (media <=900px), desktop JPG сохранены. Это гарантирует мобильный выбор даже на DPR3. Первые 2 кадра preload с раздельными media для desktop/mobile. Все build-кадры без loading=lazy/decoding=async.
Chrome headless: 1440×1000 и 390×844 (touch, DPR3), проверена публикация в подпапке /kerbez-aru-site/. Порядок этапов: 0,1,2,3,3,4,5,6,7,8,9,10,11,12,13, p3a сохранена. Проверены реальные настройки ScrollTrigger/Lenis, currentSrc, непрозрачность комнат на остановках. Нет pageerror, локальных HTTP404, горизонтального overflow. Сборка и 5 тестов прошли.
Скриншоты сохранены; мобильный просмотрен. Эмуляция не заменяет проверку на физическом телефоне.
Git-команды не запускались.
