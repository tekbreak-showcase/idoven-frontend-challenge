FROM node:18-alpine

COPY .env app/
COPY .env .
COPY app/package.json app/yarn.lock* app/
COPY app/src app/src/
COPY app/next.config.js app/
COPY app/tsconfig.json app/

RUN apk add python3 p7zip mongodb-tools

COPY data ecg-data/
RUN for f in ecg-data/*.7z ; do 7z e -y "$f" -oecg-data/; rm -rf "$f"; done

COPY parser.py ecg/
COPY utils.py ecg/
RUN chmod +x ecg/parser.py
RUN mkdir -p /app/data
RUN for f in ecg-data/*.txt ; do python3 ecg/parser.py "$f"; rm -rf "$f"; done

RUN yarn --cwd /app install
COPY init.sh ecg/
RUN chmod +x /ecg/init.sh

COPY seed.py ecg/
RUN chmod +x ecg/seed.py

CMD ["sh", "/ecg/init.sh"]
