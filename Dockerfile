FROM node:18.18-slim

# Add new fonts what you want
RUN mkdir -p /usr/share/fonts/
WORKDIR /usr/share/fonts/

COPY ./fonts/* .

# Install fonts
RUN apt update \
    && apt install -y fontconfig \
    && rm -rf /var/lib/apt/lists/*

RUN fc-cache -fv

RUN mkdir /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY . .
# Remove fonts directory
RUN rm -rf fonts  

# Project Install
RUN npm i --omit=dev

# Fix Echarts theme require error in ssr mode
#   original: factory(exports, require('echarts/lib/echarts'));
#   result: factory(exports, require('echarts'));
#RUN sed -i 's#echarts/lib/echarts#echarts#g' `grep -rl echarts /app/node_modules/echarts/theme`

WORKDIR /app
CMD ["node", "dist/index.js"]