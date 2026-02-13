# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client for build
RUN npx prisma generate

# Build frontend
RUN npm run build



# Production Stage
FROM node:20-slim AS runner

WORKDIR /app

# Install OpenSSL in runner too
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist-server/index.js"]
