#!/bin/bash

SQLITE_FILE=./Tabelas.sqlite3

if [ -f "$SQLITE_FILE" ]; then
    rm $SQLITE_FILE
fi


ruby criaEstados.rb
ruby criaMunicipios.rb
ruby criaPessoas.rb
ruby criaDocumentos.rb

ruby populaEstados.rb
ruby populaPessoas.rb
ruby populaMunicipios.rb