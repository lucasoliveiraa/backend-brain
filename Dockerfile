FROM postgres

RUN usermod -u 1000 postgres
# FROM node:18-alpine

# WORKDIR /usr/src/app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# CMD ["npm", "run", "start:dev"]
