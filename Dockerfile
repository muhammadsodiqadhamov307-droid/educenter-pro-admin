
# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client for build
RUN npx prisma generate

# Build frontend
RUN npm run build

# Compile backend
# Since we are using tsx/ts-node for dev, for prod we might want to compile or just run with tsx/ts-node.
# For simplicity and smallest image, let's compile if possible, or just use tsx in production.
# Given the setup, let's use a simple approach: running with tsx in production for now or compiling.
# Let's compile server to JS for better performance.
RUN npx tsc server/index.ts --outDir dist-server --esModuleInterop --skipLibCheck

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist-server/index.js"]
