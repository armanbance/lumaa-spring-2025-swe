#Lumaa Coding Project Setup

1. Clone the Repository
   First, clone the repository to your local machine:

   git clone <repository-url>

   cd lumaa-spring-2025-swe

2. Install Dependencies
   Run the following command to install the dependencies:

   cd backend
   npm install

   cd ..

   cd frontend

   npm install

This makes sure you install the dependencies for both the backend and the frontend.

3. Set Up Environment Variables
   Create a .env file in the backend directory with the following content:

   DB_USER=your_db_user

   DB_PASSWORD=your_db_password

   DB_HOST=localhost

   DB_PORT=5432

   DB_NAME=your_db_name

   JWT_SECRET=eb6b-XT+R867\-VFsH\BaE0m4:@v--27 #just for testing purposes, would change in the future for security purposes

   PORT=3000

   DATABASE_URL=postgres://{DB_USER}:{DB_PASSWORD}@localhost:{DB_PORT}/{DB_NAME} ##replace with your own values

This makes sure you set up the environment variables for the backend.

4. Create the Database (if not already created)
   In the terminal, run the following command to create the database:

   psql -U postgres -h localhost -p 5432

   CREATE DATABASE your_db_name;

You can replace the 5432 with the port number you are using, and your_db_name with the name of the database name you want to use.

5. Migrate the Database

   Navigate back to the backend directory and run the database migrations:

   npm run migrate

6. Run the Application

Run the following command to start the backend:

cd backend

npm run dev

7. Run the Frontend

Run the following command to start the frontend:

cd frontend

npm run dev

8. Salary Expectations

I am looking for a salary of about $25/hour, but the experience and skills I build mean more than the amount of money I make, so this salary rate is flexible.

[Click here to view the screen recording](assets/recording.mp4)
