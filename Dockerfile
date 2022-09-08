FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "start", "server"]
EXPOSE 30000