# Videochat

## Описание

Данное приложение является системой для проведения онлайн собеседований. Его отличительная особенность заключается в наличии общих радактора кода и графического редактора прямо в интерфейсе. Доступ к ним имеют все участники собеседования. Значения встроенных редакторов имеют единое состояние для всех участников.

## Технологии

### Frontend

-   Typescript
-   React
-   MobX
-   SCSS
-   WebRTC

### Backend

-   Node.js
-   Express
-   Websocket
-   Sequelize
-   PostgreSQL

## Возможности

-   Регистрироваться и авторизовываться
-   Управлять своим профилем
    -   Изменение изображения профиля
    -   Изменение никнейма
-   Искать и добавлять других пользователей в список друзей
-   Создавать чат для общения с пользователем из списка друзей
    -   В чате можно отправлять текстовые сообщения
    -   Отправлять и сохранять файлы
-   Создавать комнаты для аудио и видео конференций
    -   В конференции доступно управление микрофоном
    -   Управление камерой
    -   Возможность заглушать всех пользователей
    -   Использовать графический редактор
    -   Использовать текстовый редактор
    -   Использовать групповой чат, встроенный в комнату