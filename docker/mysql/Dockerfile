# Use an officla MySQL runtime as a parent image.
FROM mysql:latest

# Set the root password.
ENV MYSQL_ROOT_PASSWORD=password

# Create a new database if not exists.
ENV MYSQL_DATABASE=board_db

# Copy the setup.sql file and paste it into a MySQL container.
COPY setup.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

