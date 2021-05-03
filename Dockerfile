FROM node:14.16.1-alpine

# create destination directory
RUN mkdir -p /app
WORKDIR /app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY package.json /app
COPY yarn.lock /app
# build necessary, even if no static files are needed,
# since it builds the server as well
RUN yarn install
COPY . /app

# expose 3000 on container
EXPOSE 3000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3000

CMD [ "yarn", "generate" ]
# start the app
CMD [ "yarn", "dev" ]
