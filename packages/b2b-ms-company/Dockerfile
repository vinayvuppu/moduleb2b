FROM node:14-slim

ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

RUN apt-get update                                          \
 && apt-get install -y git=1:2.11.* --no-install-recommends  \
 && apt-get clean                                           \
 && rm -rf /var/lib/apt/lists/*                             \
 && mkdir /opt/node_app                                     \
 && chown node:node /opt/node_app
WORKDIR /opt/node_app

USER node
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
WORKDIR /opt/node_app/app
COPY . .

CMD [ "node", "index.js" ]