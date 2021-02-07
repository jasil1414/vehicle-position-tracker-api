
#Vehicle Positions Tracker API

####Requirements
- Postgres with Postgis
- Node v12.19.0

####Steps
- #####Project Setup
	- Run `npm install` on the project folder using a linux/unix CLI to install necessary packages.
- #####DB Setup
	- Create Database user and database named `vehicle-postions` (default DB name, you can create own DB name and pass `DB_NAME` as process environment variable)
	- Run `sh init.sh` in the project folder using a  linux/unix CLI, this will create necessary table and seed data to the database
- #####Start API
	-Run `npm start` using a  linux/unix CLI to start the application.