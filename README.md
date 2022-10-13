<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run prebuild
$ npm run build
$ npm run start:prod
```

## Docker

```bash
# docker-compose
$ docker-compose up
```

## Ньюансы
- в переменную "DB_CONNECT" передавать строку ввида "mongodb://localhost:27017/graduate_work"
- при отправке "subscribeToChat" на подписку новых сообщений, сообщения приходят событием "newMessage"

## License

Nest is [MIT licensed](LICENSE).
