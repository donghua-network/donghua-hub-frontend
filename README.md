# donghua-hub-frontend
## Deploy Local Backend
The frontend relies on API calls to a server specified by the `API_SERVER_URL` environment variable.

A development server with preconfigured permissions and data can be deployed with [Docker](https://www.docker.com) Compose: `docker-compose up -d`

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
