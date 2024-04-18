#!/bin/bash
# This script will serve as a wrapper for the operations that will
# be performed using the '.rb' files
# 
# You should used it like this:
# $ ./orm.sh <operation> <table> {<key>=<value> ... <key>=<value>}
#
# Where:
# <operation> is the operation to be performed
#   - cria
#   - altera
#   - lista
#   - deleta
# <table> is the table name
#   - estados
#   - municipios
#   - esportes
#   - documentos
#   - pessoas

# Check if the SQLite file exists
SQLITE_FILE="Tabelas.sqlite3"
if [ ! -f "$SQLITE_FILE" ]; then
    echo "SQLite file not found. Please run 'criabd.sh' first."
    exit 1
fi

# Check if the number of arguments is correct
if [ "$#" -lt 2 ]; then
    echo "Invalid number of arguments."
    echo "Usage: $0 <operation> <table> {<key>=<value> ... <key>=<value}"
    echo "Valid tables: estados, municipios, esportes, documentos, pessoas"
    echo "For more information, run: $0 help <table>"
    exit 1
fi

# function that calls the Ruby script base on the table and operation
function callRubyScript {
    case $OPERATION in
        "cria")
            ruby $1.rb cria $params
            ;;
        "altera")
            ruby $1.rb atualiza $params
            ;;
        "lista")
            ruby $1.rb lista
            ;;
        "deleta")
            ruby $1.rb deleta $params
            ;;
        "help")
            ruby $1.rb help
            ;;
    esac
}

# Check if the table is valid
OPERATION=$1
TABLE=$2
# extract the every key=value pairs
params=""
for i in $(seq 3 $#); do
    params="$params ${!i}"
done

case $TABLE in
    "estados")
        callRubyScript "estado"
        ;;
    "municipios")
        callRubyScript "municipio"
        ;;
    "esportes")
        callRubyScript "esportes"
        ;;
    "documentos")
        callRubyScript "documento"
        ;;
    "pessoas")
        callRubyScript "pessoa"
        ;;
    *)
        echo "Invalid table name."
        echo "Usage: $0 <operation> <table> {<key>=<value> ... <key>=<value}"
        echo "Valid tables: estados, municipios, esportes, documentos, pessoas"
        echo "For more information, run: $0 help <table>"
        exit 1
        ;;
esac

# Check if the operation is valid
case $OPERATION in
    "cria"|"altera"|"lista"|"deleta"|"help")
        ;;
    *)
        echo "Invalid operation."
        echo "Usage: $0 <operation> <table> {<key>=<value> ... <key>=<value}"
        echo "Valid tables: estados, municipios, esportes, documentos, pessoas"
        echo "For more information, run: $0 help <table>"
        exit 1
        ;;
esac
