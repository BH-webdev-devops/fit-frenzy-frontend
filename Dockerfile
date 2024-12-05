FROM node:19 AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_EDAMAM_API_KEY
ARG NEXT_PUBLIC_EDAMAM_API_ID
ARG NEXT_PUBLIC_YOUTUBE_API_KEY
ENV NEXT_PUBLIC_EDAMAM_API_KEYL=${NEXT_PUBLIC_EDAMAM_API_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_EDAMAM_API_ID=${NEXT_PUBLIC_EDAMAM_API_ID}
ENV NEXT_PUBLIC_YOUTUBE_API_KEY=${NEXT_PUBLIC_YOUTUBE_API_KEY}

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files and build the app
COPY . .
RUN npm run build

# Stage 2: Create a production image
FROM node:19 AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 8080

# Run the Next.js app
CMD ["npm", "start"]