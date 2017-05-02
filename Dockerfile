FROM node:alpine
WORKDIR /app
COPY index.js package.json ./
RUN npm install
CMD ["node", "index.js"]
