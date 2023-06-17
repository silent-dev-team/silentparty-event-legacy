FROM node:16-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
RUN rm -rf ./node_modules
RUN rm -rf ./dist

# install project dependencies
RUN npm install

# build app for production with minification
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]