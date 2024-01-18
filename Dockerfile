FROM futureecom/vue-app:1.2.1

COPY . /usr/app

RUN yarn install
