ARG BUILD_FROM
FROM ${BUILD_FROM}

ARG REPO="https://ewr.edge.kernel.org/alpine/edge/main"

RUN mkdir /dock ; mkdir /dock/logs

RUN echo `date` :: DOCK_BUILD:BEGIN >> /dock/logs/build

RUN apk update --repository=$REPO >> /dock/logs/build 2>&1 ; echo DOCK_BUILD:APK_UPDATE
RUN apk add --repository=$REPO --no-cache git nodejs npm >> /dock/logs/build 2>&1 ; echo DOCK_BUILD:APK_ADD
RUN cd /dock ; npm install http-proxy fastify fastify-static >> /dock/logs/build 2>&1 ; echo DOCK_BUILD:NPM_INSTALL

RUN echo `date` :: DOCK_BUILD:END >> /dock/logs/build

COPY APP.js /dock
COPY RUN.sh /dock
RUN chmod a+x /dock/RUN.sh
CMD [ "/dock/RUN.sh" ]