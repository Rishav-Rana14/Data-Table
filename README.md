# React Data Table with JSON Server Backend

This project implements a React data table component that interacts with a JSON Server backend for data management.  It provides features such as pagination, sorting, searching, column visibility control, and CRUD operations (Create, Read, Update, Delete).

## Features

*   **Data Display:**  Displays data in a tabular format with customizable columns.
*   **Pagination:** Supports server-side pagination using JSON Server.
*   **Sorting:**  Allows sorting of data by clicking on column headers, leveraging JSON Server's sorting capabilities.
*   **Searching:** Implements a search functionality to filter data based on user input.
*   **Column Visibility:**  Provides the ability to toggle the visibility of individual columns.
*   **CRUD Operations:**
    *   **Create:** Add new data entries through a modal form.
    *   **Update:** Edit existing data entries through a modal form.
    *   **Delete:** Remove data entries.
*   **Styling:** Uses styled-components for clean and maintainable styling.
*   **Notifications:** Uses `react-toastify` for displaying user-friendly notifications.

## Technologies Used

*   **React:** JavaScript library for building user interfaces.
*   **JSON Server:**  Fake REST API for prototyping and testing.
*   **Axios:**  HTTP client for making API requests.
*   **Styled-Components:** CSS-in-JS library for styling React components.
*   **React-Modal:**  Library for creating accessible modals in React.
*   **React-Toastify:** Library for displaying toast notifications.
*   **Lodash:** A JavaScript utility library, specifically `debounce`.

## Prerequisites

*   [Node.js](https://nodejs.org/) (version 12 or higher)
*   [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your_repository_url>
    cd <your_project_directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Start JSON Server:**

    *   Run the following command in a separate terminal:

        ```bash
        npx json-server --watch db.json --port 5000 
        ```

        *Note:* You may need to install `json-server` globally if you haven't already: `npm install -g json-server`

4.  **Start the React development server:**

    ```bash
    npm start  # or yarn start
    ```

    This will open the application in your browser (usually at `http://localhost:3000`).

## Data Structure (Example `db.json`)
