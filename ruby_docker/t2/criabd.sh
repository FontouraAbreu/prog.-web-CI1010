#!/bin/bash

SQLITE_FILE="Tabelas.sqlite3"

if [ -f "$SQLITE_FILE" ]; then
    rm $SQLITE_FILE
fi


ruby criaEstados.rb
ruby populaEstados.rb 

ruby criaMunicipios.rb
ruby populaMunicipios.rb

ruby criaEsportes.rb
ruby populaEsportes.rb

ruby criaDocumentos.rb

ruby criaPessoas.rb
ruby populaPessoas.rb

ruby criaEsportesPessoas.rb
ruby populaEsportesPessoas.rb

