class PersonsController < ApplicationController
    def inserir
      person = Person.create(pessoa_params)
      render json: person
    end
  
    def alterar
      person = Pessoa.find(params[:id])
      person.update(pessoa_params)
      render json: person
    end
  
    def excluir
      person = Pessoa.find(params[:id])
      person.destroy
      head :no_content
    end
  
    def listar
      pessoas = Pessoa.all
      render json: pessoas
    end
  
    private
  
    def pessoa_params
      params.permit(:last_name, :first_name, :address, :city)
    end
  end
  