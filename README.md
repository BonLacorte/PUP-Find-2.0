# PUPFIND

## PUPFIND is a web-based application designed to track missing items at the Polytechnic University of the Philippines. The system facilitates the reporting of missing items and streamlines the process of matching them with found items, providing a platform to enhance the retrieval of lost valuables.

## Flow of Operation:

* User1 reports a missing item with a status of 'missing.'
* User2 and User3 report found items with a status of 'processing.'
* Found items must be surrendered to a designated office; failure to do so keeps the report status as 'processing.'
* Admin reviews all missing reports and relevant found reports for potential matches.
* Upon verification, the admin communicates with the owner of the missing report.
* Once the owner claims the item, both missing and found reports are updated to 'claimed.'

## User Functions:

* Register, log in, and log out of an account.
* Create missing and found item reports.
  * Missing item report: Item Name, Date, Possible location, Description, Item image (optional).
  * Found item report: Item Name, Date, Possible location, Description, Item image (required), and Surrender Office.
* Real-time chat function with admins.
* View a list of created reports.
* Edit account information.

## Admin Functions:

* Register, log in, and log out of an account.
* View top locations of lost items within the campus.
* Analyze the frequency of missing item reports per month.
* Create missing and found item reports for offline operations.
  * Missing item report: Item Name, Date, Possible location, Description, Item image (optional), and User's UID.
  * Found item report: Item Name, Date, Possible location, Description, Item image (optional), and User's UID.
* View tables of all missing and found reports designated to their office.
* Delete a report.
* Generate and download a receipt for a claimed report.
* Match similar missing and found reports.
* Generate CSV files for reports and users.
* Real-time chat function with users.
* Create a user account.

## Run Locally:

I can't share the keys that were used for website. As a solution, I provide the keys from my other email account so that I can give the sample admins which you can try.

1. Clone or download the project from the GitHub repository.
     ```bash
     git clone https://github.com/BonLacorte/PUP-Find-2.0.git
     ```
2. Extract the downloaded zip file.
3. Open VSCode and navigate to the extracted folder.
4. Create an `.env` file in the backend folder and copy the provided environment variables.

    Copy these code and paste to `.env`:
    ```bash
    DATABASE_URI=mongodb+srv://mongotut:testing123@cluster0.1etcjir.mongodb.net/PUPFindDB?retryWrites=true&w=majority
    PORT=3500
    NODE_ENV=development
    SECRET_ACCESS_KEY=96ed1ae842501f68a0b7387a22b710bdcd271763b77f29299dc495d4bfcb1686c220693ed801d5377959465802f640eef111a3704f68c6df0a7a1b871f679e62
    ACCESS_TOKEN_SECRET= e8d7ef2059f0df571c207d0ca5e623976fe653a277d15935d55c52b7706063f8b437df1d1a4c4683319804743585eb6cfe878571aebf8bdff5c81c648f9a091c
    REFRESH_TOKEN_SECRET= 78f0ab29f8f9e7fb3b0b06c7b3433550bcda94f243f04545aa3a0b522f8baccbbf1fdba43791e83eee6f513cfe32396e00f96c97f45b04515c43dd48ba47ed28
    JWT_EXPIRES = 7d
    CLOUDINARY_CLOUD_NAME=dkzlw5aub
    CLOUDINARY_API_KEY=481291378255989
    CLOUDINARY_API_SECRET=1N1ACcGuWB5R3opOP7M6HlVAVtU
    ```
   
5. Change the server link to localhost in frontend/src/server.jsx.

   from:
   ```bash
   export const server = "https://pupfind2.onrender.com";
   // export const server = "http://localhost:3500";
   ```

   to:
   ```bash
   // export const server = "https://pupfind2.onrender.com";
   export const server = "http://localhost:3500";
   ```
6. Open two terminals, one for the frontend and one for the backend.

   First terminal:
   ```bash
   cd frontend
   ```
   Second terminal:
   ```bash
   cd frontend
   ```
7. Install dependencies using `npm install` in both frontend and backend folders.

   First terminal:
   ```bash
   npm install
   ```
   Second terminal:
   ```bash
   npm install
   ```
8. Run the frontend and backend using `npm run dev` and `npm run start`, respectively.

   First terminal:
   ```bash
   npm run dev
   ```
   Second terminal:
   ```bash
   npm run start
   ```
9. Access the admin interface via `/admin`
10. Use the provided admin accounts for testing:

   **Email:** sampleadmin1@gmail.com **Password:** @SampleUser123

   **Email:** sampleadmin1@gmail.com **Password:** @SampleUser123
