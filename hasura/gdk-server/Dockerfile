FROM tecktron/python-waitress:python-3.7-slim

COPY ./ /app
WORKDIR /app

RUN pip install https://github.com/Blockstream/gdk/releases/download/release_0.0.38/greenaddress-0.0.38-cp37-cp37m-linux_x86_64.whl
RUN pip install flask
