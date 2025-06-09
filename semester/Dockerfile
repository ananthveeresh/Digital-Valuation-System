FROM docker.io/library/eclipse-temurin:19



LABEL maintainer="Kumar PSR <kumarpsr9@gmail.com>"

RUN curl --remote-name https://languagetool.org/download/LanguageTool-6.3.zip && \
    jar xvf ./LanguageTool-6.3.zip && \
    rm LanguageTool-6.3.zip

WORKDIR /LanguageTool-6.3

COPY start.sh .
CMD [ "sh", "start.sh" ]
USER nobody
EXPOSE 8010