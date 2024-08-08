FROM node:hydrogen-alpine as build-stage

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --network-timeout 240000

COPY src/ src/
COPY public/ public/
COPY tsconfig.json .
COPY .prettierrc .
COPY .eslintignore .
COPY .eslintrc.json .
COPY .env .

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.21-alpine

# Toggle visibility of cookie policy, privacy policy, and terms & conditions
ENV SCRUMLR_SHOW_LEGAL_DOCUMENTS=''

# Override the server address for API calls
ENV SCRUMLR_SERVER_URL=''

# Override the websocket address for API calls
ENV SCRUMLR_WEBSOCKET_URL=''

# Server port
ENV SCRUMLR_LISTEN_PORT='8080'

# Analytics variables
ENV SCRUMLR_ANALYTICS_DATA_DOMAIN=''
ENV SCRUMLR_ANALYTICS_SRC=''

COPY ./nginx.conf /etc/nginx/templates/scrumlr.io.conf.template
COPY ./security-headers.conf /etc/nginx/conf.d/security-headers.conf
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
