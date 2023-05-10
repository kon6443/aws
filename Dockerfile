FROM node:16

# Creating an app directory.
WORKDIR /app

# Installing app dependencies.
COPY package*.json ./

RUN npm install

# Copying rest of the applications to app directory. 
COPY ../../ /app

# Exposing the port and starting the application.
Expose 80

CMD ["npm", "start"]


