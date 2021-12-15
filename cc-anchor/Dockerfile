FROM node:12



ENV TARGET_FOLDER_NAME="cc-anchor"
RUN mkdir -p $TARGET_FOLDER_NAME
WORKDIR $TARGET_FOLDER_NAME
COPY . .
RUN npm install --unsafe-perm --production


RUN echo 'node ./lib/index.js' >> startup-script.sh
RUN cat startup-script.sh

EXPOSE 9999/tcp

CMD bash startup-script.sh
