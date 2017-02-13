FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "--max_old_space_size=10000", "index.js"]
