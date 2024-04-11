class BorrowingsController < ApplicationController
    def inserir
      borrowing = Borrowing.new(borrowing_params)
      if borrowing.save
        render json: borrowing
      else
        render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def alterar
      borrowing = Borrowing.find(params[:id])
      if borrowing.update(borrowing_params)
        render json: borrowing
      else
        render json: { errors: borrowing.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def excluir
      borrowing = Borrowing.find(params[:id])
      borrowing.destroy
      head :no_content
    end
  
    def listar
      borrowings = Borrowing.all
      render json: borrowings
    end

    def destroy_all
        Borrowing.where(book_id: params[:book_id]).destroy_all
        head :no_content
    end
    
  
    private
  
    def borrowing_params
      params.require(:borrowing).permit(:person_id, :book_id)
    end
  end
  