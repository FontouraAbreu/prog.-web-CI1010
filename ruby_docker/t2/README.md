# Banco de dados usando ActiveRecord

## Objetivo

Criar e usar um banco de dados utilizando ActiveRecord.

## Relação entre as Entidades

Temos as entidades `Pessoa`, `Estado`, `Municipio`, `Documento` e `Esporte`.
A relação entre as entidades pode ser vista o seguinte diagrama:


## Execução

### Criando e populando a base de dados

Para criar e popular a base de dados, execute o comando:

```bash
./criadb.sh
```

Este comando irá criar o banco de dados `db.sqlite3` e popular as tabelas com dados de exemplo presentes no diretório [csv](./csv/).

### Executando o programa

A partir do executável `orm.sh` é possível executar as seguintes operações:

- `lista`: Lista todas as entradas de uma tabela
- `cria`: Adiciona uma nova entrada em uma tabela
- `deleta`: Remove uma entrada de uma tabela
- `altera`: Atualiza uma entrada de uma tabela

As tabelas disponíveis são:

- `pessoas`
- `estados`
- `municipios`
- `documentos`
- `esportes`



### Exemplos