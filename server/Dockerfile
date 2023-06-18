FROM python:3.11
RUN pip install --upgrade pip
RUN pip install pipenv
WORKDIR /app
COPY Pipfile Pipfile.lock ./
RUN pipenv install
COPY . .
CMD ["pipenv", "run", "python", "app.py", "local"]