class PersonsController < ApplicationController
    def inserir
      person = Person.new(person_params)
      render json: person
      if person.save
        render json: person, include: :phone
      else
        render json: { errors: person.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def alterar
      person = Person.find(params[:id])
      if person.update(person_params)
        render json: person, include: :phone
      else
        render json: { errors: person.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def excluir
      person = Person.find(params[:id])
      person.destroy
      head :no_content
    end
  
    def listar
      person = Person.all
      render json: person, include: :phone
    end

    def borrowings
      person = Person.find(params[:id])
      borrowings = person.borrowings
      render json: borrowings, include: [:book]
    end
  
    private
  
    def person_params
      params.permit(:last_name, :first_name, :address, :city, phone_attributes: [:id, :number])
    end
  end
  