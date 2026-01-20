# Wataru API

Wataru API is a modern, interactive API documentation and testing interface built with HTML, Tailwind CSS, and JavaScript. It provides a sleek, dark-themed dashboard for developers to explore, test, and integrate API endpoints with ease.

## Features

- **Interactive API Testing**: Test API endpoints directly from the dashboard with a built-in request/response interface
- **Modern Dark Theme UI**: Sleek, responsive design with animations and visual effects
- **Categorized API Navigation**: Organized sidebar with searchable categories and endpoints
- **Real-time API Response Visualization**: View formatted JSON responses with syntax highlighting
- **Notification System**: Built-in notification center with localStorage persistence
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Dynamic Configuration**: Easily customizable through a `settings.json` file
- **Loading Animations**: Smooth transitions and loading states for better UX
- **API Statistics**: Dashboard with endpoint counts and category metrics

## Live Demo

Check out a live demo of Wataru API [here](https://wataru-api.vercel.app)

## Setup

### Prerequisites

- Node.js (>= 14.0.0)
- Express.js for the backend server

### Installation

1. Clone the repository to your local machine:

```shellscript
git clone https://github.com/yourusername/wataru-api.git
```

2. Navigate to the project directory:

```shellscript
cd wataru-api
```

3. Install dependencies:

```shellscript
npm install
```

4. Modify the `settings.json` file to configure your API documentation.
5. Start the server:

```shellscript
npm start
```

Your API documentation should now be available at `http://localhost:4000`.

> **Note**: The system will automatically detect your GitHub repository information and use it in the dashboard. The repository name and author will be displayed in the appropriate sections of the UI.

## Creating API Endpoints

Wataru API makes it easy to create and document API endpoints. Each endpoint is defined as a Node.js module with metadata and a handler function.

### Example API Endpoint

Here's an example endpoint that comes with Wataru API:

```javascript
const meta = {
  name: "hello",
  version: "1.0.0",
  description: "A simple example API that returns a greeting message",
  author: "Your Name", 
  method: "get",
  category: "examples",
  path: "/hello?name="
};

async function onStart({ res, req }) {
  // Extract the 'name' parameter from the query string
  const { name } = req.query;

  // Default to 'World' if no name is provided
  const greeting = name ? `Hello, ${name}!` : "Hello, World!";

  // Return a simple JSON response
  return res.json({
    message: greeting,
    timestamp: new Date().toISOString(),
    powered_by: "Wataru API"
  });
}

module.exports = { meta, onStart };
```

Place this file in your API endpoints directory (typically `/endpoints/`), and Wataru API will automatically detect and display it in the dashboard.

## Customization

You can easily customize the UI by editing the `settings.json` file. Below is a breakdown of the configurable fields:

### General Settings

- `name`: Sets the name of your API (e.g., "Wataru's Api").
- `version`: Specifies the version of your API interface (e.g., "Wataru UI").
- `description`: A brief description of your API documentation.

### Header Customization

- `status`: Indicates the current status of your API (e.g., "Online!").
- `imageSrc`: An array of image URLs to display in the header. Multiple images can be set for variety.
- `imageSize`: Defines responsive image sizes based on the device type:
  - `mobile`: Size for mobile devices (e.g., "80%").
  - `tablet`: Size for tablets (e.g., "40%").
  - `desktop`: Size for desktops (e.g., "40%").

### Api Settings

- `creator`: Displays the creator's name in the interface. Set to "auto" to use the repository owner's name.

### Links

- `name`: Label for the link (e.g., "Source Code").
- `url`: The URL to the resource. Use "auto" to automatically link to the current repository.

### Notifications

You can configure notifications that will appear in the dashboard:

```json
"notifications": [
  {
    "title": "Welcome to API Dashboard",
    "message": "Explore our APIs and integrate them into your projects."
  },
  {
    "title": "New Feature",
    "message": "We've added support for WebSocket APIs. Check them out!"
  }
]
```

### Example `settings.json`

Here's an example of how your settings.json file might look:

```json
{
  "name": "Wataru's Api",
  "version": "Wataru UI",
  "description": "Simple and Easy-to-Use API Documentation",
  "header": {
    "status": "Online!",
    "imageSrc": [
      "https://media4.giphy.com/media/l0Iy33dWjmywkCnNS/giphy.gif?cid=6c09b952p3mt40j1mgznfi9rwwtccbjl7mtc2kvfugymeinr&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g"
    ],
    "imageSize": {
      "mobile": "80%",
      "tablet": "40%",
      "desktop": "40%"
    }
  },
  "apiSettings": {
    "creator": "Your Name" 
  },
  "links": [
    {
      "name": "Source Code",
      "url": "Your Name"
    },
    {
      "name": "Contact Me",
      "url": "https://t.me/ajirodesu"
    }
  ],
  "notifications": [
    {
      "title": "Welcome to API Dashboard",
      "message": "Explore our APIs and integrate them into your projects."
    },
    {
      "title": "New Feature",
      "message": "We've added support for WebSocket APIs. Check them out!"
    }
  ]
}
```

## Dashboard Features

The Wataru API dashboard includes:

1. **Interactive Sidebar**:
   1. Categorized API endpoints
   2. Search functionality with keyboard shortcut (Ctrl+K)
   3. Collapsible categories

2. **API Testing Interface**:
   1. Test endpoints directly from the dashboard
   2. Input parameters with validation
   3. Formatted JSON responses with syntax highlighting

3. **Notification Center**:
   1. Real-time notifications
   2. Persistent notification storage
   3. Unread indicators

4. **Statistics Dashboard**:
   1. Total API count
   2. Category breakdown
   3. Method-specific metrics (GET, POST, etc.)

5. **Responsive Design**:
   1. Mobile-friendly navigation
   2. Adaptive layout for different screen sizes
   3. Touch-optimized interactions

## Advanced API Example

For more complex use cases, here's an example of an additional functionality endpoint:

```javascript
const meta = {
  name: "example",
  version: "1.0.0",
  description: "A simple example API that demonstrates basic functionality",
  author: "Your Name", 
  method: "get",
  category: "examples",
  path: "/example?text="
};

async function onStart({ res, req }) {
  // Extract the 'text' parameter from the query string
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ 
      status: false, 
      error: 'Text parameter is required' 
    });
  }

  // Process the text (in this example, we'll just reverse it)
  const reversed = text.split('').reverse().join('');

  // Return a JSON response
  return res.json({
    original: text,
    reversed: reversed,
    length: text.length,
    timestamp: new Date().toISOString(),
    powered_by: "Wataru API"
  });
}

module.exports = { meta, onStart };
```

# Support

This project is designed to be easily deployable on various platforms. You can host it on any platform that supports Node.js applications. Some popular options include:

- **[Vercel](https://vercel.com/)**: Easy deployment with minimal configuration.
- **[Heroku](https://www.heroku.com/)**: A platform-as-a-service for deploying, managing, and scaling apps.
- **[Netlify](https://www.netlify.com/)**: A platform for deploying static sites and serverless functions.
- **[DigitalOcean](https://www.digitalocean.com/)**: Cloud infrastructure for deploying apps with more control over the environment.
- **[AWS](https://aws.amazon.com/)**: Amazon Web Services for scalable and customizable cloud hosting.
- **[Railway](https://railway.app/)**: A platform for deploying apps with easy integration and deployment steps.

Make sure your platform supports Node.js, and configure it to run your API according to the platform's deployment guidelines.

If you need help with deployment, feel free to reach out to the creator or check the documentation of your chosen platform.

## Deploy to Cloudflare Workers

You can deploy this project directly to Cloudflare Workers by clicking the button below:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/<YOUR_USERNAME>/<YOUR_REPO>)

> **Note**: Please replace `<YOUR_USERNAME>` and `<YOUR_REPO>` in the link above with your actual GitHub repository details.

Alternatively, you can deploy via CLI:

```bash
npm run deploy
```

# Credits

This project is created and maintained by:

- **[Rynn](https://github.com/rynxzyy)**: Creator and main developer of the project.
- **[Lenwy](https://github.com/Lenwyy)**: For the inspiration behind the project.
- **[AjiroDesu](https://github.com/ajirodesu)**: The one who modify the entire API functionality and Website's ui and ux.

Special thanks for the support and contributions throughout the development.

## License

This project is licensed under the [MIT License](LICENSE).#   w a t a r u  
 