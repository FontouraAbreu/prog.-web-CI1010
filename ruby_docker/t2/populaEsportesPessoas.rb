$:.push './'
require 'pessoa.rb'
require 'esporte.rb'
require 'csv'

# Esportes
esportes = Esportes.all
pessoas = Pessoas.all

pessoas.each do |pessoa|
    numero_aleatorio_de_esportes = rand(6)
    for i in 0..numero_aleatorio_de_esportes
        esporte = esportes.sample
        pessoa.esportes << esporte
        esporte.pessoas << pessoa
    end
end