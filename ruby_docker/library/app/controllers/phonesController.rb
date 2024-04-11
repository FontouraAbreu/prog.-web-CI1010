class PhonesController < ApplicationController
    def inserir
      phone = Phone.new(phone_params)
      if phone.save
        render json: phone, include: :person
      else
        render json: { errors: phone.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def alterar
      phone = Phone.find(params[:id])
      if phone.update(phone_params)
        render json: phone, include: :person
      else
        render json: { errors: phone.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def excluir
      phone = Phone.find(params[:id])
      phone.destroy
      head :no_content
    end
  
    def listar
      phones = Phone.all
      render json: phones, include: :person
    end
  
    private
  
    def phone_params
      params.require(:phone).permit(:number, :person_id)
    end
  end
  