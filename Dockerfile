FROM node:24-bookworm-slim AS build

COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build

RUN npm prune --omit=dev
RUN npm cache clean --force

FROM gcr.io/distroless/nodejs24-debian12

ENV NODE_ENV=production

COPY --from=build /app /app
WORKDIR /app

EXPOSE 5000
CMD [ "build/index.js" ]
