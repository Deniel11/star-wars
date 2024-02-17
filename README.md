# 🌌 SWAPI People Gallery ☄️

## 📄 Description 📄
This web gallery was created for an interview project and is built using Next.js 14. The project incorporates the following features:
✔️ Displays a comprehensive list of people from the swapi.dev API website.
✔️ Utilizes pagination with the swapi.dev/people endpoint by allowing dynamic page fetching using ?page=1.
✔️ Implements a search functionality for names using the swapi.dev API.
✔️ Includes additional filtering options for gender and homeworld in the search feature.

## 🚀 API 🚀
The application relies on the SWAPI (Star Wars API) available at swapi.dev.

## 🛰️ Tools 🛰️
The project is developed using React, Next.js, Tailwind CSS, and TypeScript.

### 🔧 Dependencies 🔧
The following dependencies are used in the project:
- "classnames": "^2.5.1",
- "next": "14.1.0",
- "paginate": "^0.2.0",
- "pagination": "^0.4.6",
- "react": "^18",
- "react-dom": "^18",
- "react-paginate": "^8.2.0",
- "react-router-dom": "^6.22.0"

## 📔 Guide 📔
- Clone this repository to your local machine.
- Run the 'npm run dev' command to start the web server.
- Access the local version of the project at 'localhost:3000'.

To navigate the main page, the initial display showcases the first 10 characters. From here, users can explore the following options within the page:

🔍**Search:** Conduct searches based on character names. The search utilizes the 'swapi.dev' API, and the page number adjusts dynamically based on search results.

🏽**Filtering:** Apply filters to narrow down results based on gender and homeworld. It's important to note that filtering is limited to the current page to optimize API calls.

🔢**Pagination:** Navigate between pages to view additional characters. Each page switch triggers a new API call.

These features collectively provide a user-friendly experience for exploring and discovering Star Wars characters through the SWAPI People Gallery.

