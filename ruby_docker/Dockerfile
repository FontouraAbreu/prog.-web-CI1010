FROM ruby:3.0.0

ENV RAILS_VERSION=7.0.5

RUN apt-get update -qq && apt-get install -y sqlite3

# Install dependencies
RUN gem install rails -v $RAILS_VERSION


WORKDIR /app/t2

RUN bundle install
