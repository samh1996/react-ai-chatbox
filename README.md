# AI Chatbot - React Multi-Assistant Chat Application

A modern, responsive chat application built with React and Vite that supports multiple AI assistants including Google AI (Gemini) and OpenAI (GPT). Features real-time streaming responses, markdown support, and a clean, intuitive interface.

## ✨ Features

- **Multiple AI Assistants**: Switch between Google AI (Gemini) and OpenAI (GPT) models
- **Real-time Streaming**: Get responses as they're generated for a natural chat experience
- **Multiple Chat Sessions**: Create and manage multiple independent chat conversations
- **Markdown Support**: Rich text formatting with code syntax highlighting
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Chat History**: Persistent conversation history with context awareness

## 🚀 Deployment on Vercel

### Prerequisites for Deployment

- Vercel account
- GitHub repository (recommended)
- API keys for Google AI and/or OpenAI

### Deploy Steps

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:

   ```
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

### Local Development with API Routes

To test the API routes locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run development server with API routes
vercel dev
```

This will start both your React app and API routes locally.

## 🔒 Security Features

- **API Keys Protected**: All API keys are stored securely on the server
- **No Client-Side Exposure**: API keys never reach the browser
- **CORS Configured**: Proper cross-origin resource sharing setup
- **Error Handling**: Comprehensive error handling for API failures

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- API keys for Google AI and/or OpenAI

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd react-ai-chatbox
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Add your API keys to `.env.local`**

   ```env
   VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   VITE_OPEN_AI_API_KEY=your-open-ai-api-key-here
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Getting API Keys

### Google AI (Gemini)

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

### OpenAI

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key to your `.env.local` file

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🚀 Deployment on Vercel

### Prerequisites for Deployment

- Vercel account
- GitHub repository (recommended)
- API keys for Google AI and/or OpenAI

### Deploy Steps

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   In your Vercel project settings, add these environment variables:

   ```
   GOOGLE_AI_API_KEY=your-google-ai-api-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - Your app will be available at `https://your-project-name.vercel.app`

### Local Development with API Routes

To test the API routes locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run development server with API routes
vercel dev
```

This will start both your React app and API routes locally.

## 🔒 Security Features

- **API Keys Protected**: All API keys are stored securely on the server
- **No Client-Side Exposure**: API keys never reach the browser
- **CORS Configured**: Proper cross-origin resource sharing setup
- **Error Handling**: Comprehensive error handling for API failures

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Assistant/          # AI assistant selector
│   ├── Chat/              # Main chat interface
│   ├── Controls/          # Message input controls
│   ├── Loader/            # Loading spinner
│   ├── Messages/          # Message display and formatting
│   ├── Sidebar/           # Chat navigation sidebar
│   └── Theme/             # Theme toggle component
├── assistants/
│   ├── googleai.js        # Google AI integration
│   └── openai.js          # OpenAI integration
├── App.jsx                # Main application component
└── main.jsx              # Application entry point
```

## 🎯 Usage

1. **Select an AI Assistant**: Choose between Google AI or OpenAI models from the dropdown
2. **Start Chatting**: Type your message and press Enter or click Send
3. **Create New Chats**: Click the "+" button to start a new conversation
4. **Switch Between Chats**: Click on any chat in the sidebar to switch contexts
5. **View Responses**: Watch as AI responses stream in real-time with markdown formatting

## 🔧 Configuration

### Supported Models

**Google AI (Gemini)**

- `gemini-3-flash-preview`
- `gemini-2.5-flash`

**OpenAI**

- `gpt-5-mini`
- `gpt-5-nano`

### Customization

You can customize the application by:

- Adding new AI models in the Assistant component
- Modifying themes in the CSS modules
- Extending the chat functionality in the Chat component

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**

- Ensure your API keys are correctly set in `.env.local`
- Verify the keys are valid and have sufficient credits/quota

**Build Errors**

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all environment variables are properly prefixed with `VITE_`

**Styling Issues**

- Ensure CSS modules are properly imported
- Check browser compatibility for modern CSS features

Built with ❤️ using React, Vite, and modern AI APIs
