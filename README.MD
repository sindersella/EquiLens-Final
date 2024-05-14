# EquiLens

## Overview

EquiLens is a pioneering web application designed to assess and rank social media platforms based on their neutrality regarding content censorship on social issues and human rights violations. Our mission is to promote transparency, accountability, and freedom of expression in the digital realm, empowering users to make informed decisions about their online presence.

## Features

- **Neutrality Ranking**: EquiLens evaluates and ranks social media platforms based on their impartiality in addressing content related to social issues and human rights violations. Users can view and compare these rankings to choose platforms that align with their values.
- **Informative Insights**: Gain in-depth insights into each platform's policies, moderation practices, and historical performance on key topics. This helps users understand the broader context of content moderation and platform behavior.
- **User Empowerment**: Make choices aligned with your values by understanding the ideological stance of social media platforms. EquiLens empowers users with the information needed to navigate the digital landscape responsibly.
- **Community Collaboration**: Join a community of like-minded individuals to share experiences, engage in discussions, and advocate for a fairer online space. Users can contribute to the platform's data and participate in community-driven initiatives.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MySQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-url/EquiLens.git
   ```

2. Navigate to the project directory:
   ```bash
   cd EquiLens
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up the MySQL database:
   - Create a MySQL database and import the provided `database.sql` file to set up the necessary tables and data.

5. Configure the database connection:
   - Update the database configuration in `config.js` or as per your project structure.

6. Start the application:
   ```bash
   npm start
   ```

### Usage

1. Open your web browser and navigate to `http://localhost:3000`.

2. To test the features, you can use the following example user account:
   - **Username**: sundus
   - **Password**: Apples123

3. Explore the various features such as viewing all rankings, filtering rankings by platform or issue, and accessing detailed insights into each platform.

### File Structure

- **index.js**: The entry point of the application, initializing the Express server and setting up middleware and routes.
- **routes/main.js**: Contains the main application logic, including routes for different pages like home, user, rankings, and platforms. It handles session validation, search functionality, and interactions with the MySQL database.
- **views**: Contains EJS files for rendering different pages.
- **public**: Contains static files like CSS and images.

### Contributing

We welcome contributions from the community. If you would like to contribute, please fork the repository, make your changes, and submit a pull request.

### License/Copyright


This project and its accompanying web application were developed by Sundus Abdi for her final year project in BSc Computer Science at Goldsmiths, University of London. It features primarily original code, supplemented with material from the Database and the Web module, as well as techniques learned from various YouTube tutorials detailed in the project report.

----

## Thanks for your interest in my project, goodbye!
