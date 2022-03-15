FROM node:12

RUN mkdir cc-home
WORKDIR cc-home
RUN mkdir bin
COPY ./package.json .
COPY ./env.json .
COPY ./octopus.json .
COPY ./bin/mkDevEnv.js ./bin/mkDevEnv.js
RUN npm run dev-install --unsafe-perm

ENV TARGET_FOLDER_NAME="cc-anchor"
RUN mkdir -p $TARGET_FOLDER_NAME
WORKDIR /cc-home/$TARGET_FOLDER_NAME
COPY ./cc-anchor/ .
RUN npm install --unsafe-perm --production


RUN echo 'node ./lib/index.js' >> startup-script.sh
RUN cat startup-script.sh

EXPOSE 9999/tcp

CMD bash startup-script.sh
