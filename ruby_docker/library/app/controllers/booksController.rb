class BooksController < ApplicationController
    before_action :set_book, only: [:update, :destroy]
  
    def listar
      @books = Book.all
      render json: @books
    end
  
    def inserir
      @book = Book.new(book_params)
  
      if @book.save
        render json: @book, status: :created, location: @book
      else
        render json: @book.errors, status: :unprocessable_entity
      end
    end
  
    def alterar
      if @book.alterar(book_params)
        # Atualizar os borrowings associados
        update_borrowings
        render json: @book
      else
        render json: @book.errors, status: :unprocessable_entity
      end
    end
  
    def excluir
      # Excluir os borrowings associados antes de excluir o livro
      destroy_borrowings
      @book.excluir
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_book
        @book = Book.find(params[:id])
      end
  
      # Only allow a trusted parameter "white list" through.
      def book_params
        params.require(:book).permit(:title, :author)
      end
  
      # Excluir os borrowings associados ao livro antes de excluir o livro
      def destroy_borrowings
        @book.borrowings.destroy_all
      end
  end
  