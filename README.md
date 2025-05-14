# Adopme
Adopme is a web application designed to streamline pet adoption processes for pet shelters.

## Prerequisites
- Node.js
- Java 21
- Docker / MySQL Workbench

## Getting Started
### Running The Frontend Application
1. From the root of the project, navigate to the `frontend` directory.
```shell
cd frontend
```
2. Install the required dependencies.
```shell
npm install
```
3. Start the development server.
```shell
npm run dev
```
To terminate the application, press `Ctrl + C`.

### Running The Backend Application
#### Using Docker
1. From the root of the project, run following command to start the docker containers.
```shell
docker compose up -d
```
2. Once the containers are up, run the application.

To terminate all docker containers:
```shell
docker compose down
```
#### Using MySQL Workbench
1. Create a new schema called `adopme`.
2. Run the application.


### Running Spotless
The Maven Spotless Plugin is a tool that automatically formats and enforces code style standards across various programming languages, during the build process.

To run Spotless, execute the following command from the root of the project:
```shell
mvn spotless:apply
```
This will format the code according to the defined rules in the `pom.xml` file.