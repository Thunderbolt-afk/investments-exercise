# investments-exercise

Brief description of investments-exercise project.

## Requirements

- Node.js
- npm
- SQL Server (or other relational database technology)

## Installation Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Thunderbolt-afk/investments-exercise.git
   cd investments-exercise
   ```

2. **Install the dependencies**

   Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Create a database**

   Create an empty database on SQL Server (or the relational database technology of your choice). SQL Server is suggested here because there is already a connection string for SQL Server in the `.env` file.

4. **Configure the .env file**

   A `.env` file has been included for illustrative purposes to simplify project setup. However, as a best practice, it is recommended not to push the `.env` file to production. 

   You need to replace the placeholders `DBNAME`, `USERNAME`, and `PASSWORD` in the following connection string:

   ```plaintext
   DATABASE_URL="sqlserver://localhost:1433;database=DBNAME;user=USERNAME;password=PASSWORD;encrypt=false;trustServerCertificate=true"
   ```

   with your actual database credentials. If you opted for a different database technology, ensure to update the connection string accordingly. You can refer to the [Prisma documentation](https://www.prisma.io/docs/orm/reference/prisma-schema-reference) for information on connection strings.


5. **Modify the schema.prisma file**

   If you chose a different technology than SQL Server, you need to modify the `datasource db` in the `schema.prisma` file by setting the `provider` property to the technology you are using:

   ```prisma
   datasource db {
     provider = "sqlserver" // Change this to your database technology (e.g., "postgresql", "mysql", etc.)
     url      = env("DATABASE_URL")
   }
   ```

6. **Align the database with Prisma**

   Run the following command to align your database with the Prisma schema located in the `/prisma` folder:

   ```bash
   npx prisma db push
   ```
7. **Compile the project**

   Before starting the service, compile the project using:

   ```bash
   npm run compile
   ```

8. **Start the service**

   You can start the service using one of the following commands:

   - For Unix environments:

     ```bash
     npm run start
     ```

   - For Windows:

     ```bash
     npm run start:windows
     ```

9. **Run the tests**

   If you want to check the various tests implemented with Jest and Supertest, run:

   ```bash
   npm run test
   ```

## Contribution

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
