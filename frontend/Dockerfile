# Use Node to build the React app
FROM node:18 as build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve using NGINX
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional for routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
