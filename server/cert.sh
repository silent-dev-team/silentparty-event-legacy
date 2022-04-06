#!/bin/bash

openssl req -x509 -new -keyout root.key -out root.cer -config root.cnf
openssl req -nodes -new -keyout server.key -out server.csr -config server.cnf
openssl x509 -days 3650 -req -in server.csr -CA root.cer -CAkey root.key -set_serial 123 -out server.cer -extfile server.cnf -extensions x509_ext
