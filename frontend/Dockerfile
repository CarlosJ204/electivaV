# --- Etapa 1: compilar la app Expo para web ---
FROM node:22-alpine AS build
WORKDIR /app
COPY finnova-mobile/package*.json ./
RUN npm ci
COPY finnova-mobile/ ./
# En producción nginx sirve la web y reenvía /api al backend (mismo origen)
ENV EXPO_PUBLIC_API_URL=/api
RUN npx expo export --platform web

# --- Etapa 2: servir con nginx ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
