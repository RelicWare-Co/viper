FROM oven/bun:1 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies with Bun
COPY package.json bun.lock* bunfig.toml ./
RUN bun install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Add a build argument to force rebuild when needed
RUN bun run build

# Production image, copy all the files and run the app
FROM base AS production
WORKDIR /app

# Copy only necessary files from builder
COPY . .

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

# Run the application
CMD ["bun", "start"]