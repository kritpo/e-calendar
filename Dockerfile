FROM node:16-alpine as tsc-builder

WORKDIR /usr/src/e-calendar

COPY .eslintignore ./
COPY .eslintrc.json ./
COPY .prettierignore ./
COPY .prettierrc.json ./
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY tsoa.json ./
COPY src ./src

RUN npm ci
RUN npm run full-rebuild

########

FROM node:16-alpine as runtime

ENV NODE_ENV=production
ENV PORT=80

WORKDIR /usr/src/e-calendar

COPY package.json ./
COPY package-lock.json ./
COPY --from=tsc-builder /usr/src/e-calendar/dist ./dist

RUN npm ci --production

EXPOSE ${PORT}

CMD ["npm","start"]