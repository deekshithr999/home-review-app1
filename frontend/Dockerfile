# Stage 1: Build React app
FROM node:18 as build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve using NGINX
FROM nginx:stable-alpine


# Replace the default NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Copy the build output to NGINX’s default public folder
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]