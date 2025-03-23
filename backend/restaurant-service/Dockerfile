FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "run", "dev"]

