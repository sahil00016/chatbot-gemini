Chatbot-Gemini: AI and PDF Chat Application
This is a Next.js-based chatbot application that integrates user authentication with Supabase, PDF parsing, Gemini AI for conversational responses, and chat history storage. The application fulfills the requirements of the internship assignment, providing a seamless interface for users to interact with AI or query uploaded PDF documents.
Features
Task 1: User Authentication

Technology: Next.js with Supabase Auth.
Functionality:
Users can sign in and out securely using Supabase’s authentication system (supports JWT-based authentication).
Only authenticated users can access the chatbot interface (/chatbot route).
Redirects unauthenticated users to the /signin page.


Implementation: 
Uses supabase-js for authentication.
src/supabase-provider.tsx wraps the app to provide Supabase client context.
src/app/chatbot/page.tsx checks user authentication status and redirects if not logged in.



Task 2: Gemini API Integration and PDF Parsing

Technology: Next.js API routes, Gemini API, pdf-parse library.
Functionality:
AI Chat Mode: Users can interact with the Gemini AI by sending queries, receiving meaningful responses.
PDF Chat Mode: Users can upload PDF files, which are parsed server-side to extract text. Users can then ask questions about the PDF content, processed by the Gemini API.
Frontend Interface: A responsive React-based UI in src/app/chatbot/page.tsx allows mode switching (AI/PDF), PDF uploads, and chat interactions.


Implementation:
PDF Parsing: src/app/api/parse-pdf/route.ts uses pdf-parse to extract text from uploaded PDFs.
Gemini API: src/app/api/gemini-chat/route.ts sends user queries (and PDF text in PDF mode) to the Gemini API for responses.
UI: Built with Tailwind CSS for styling, featuring a clean interface with mode toggle buttons, PDF upload button, chat input, and message display.



Task 3: Chat History Storage

Technology: Supabase (PostgreSQL) for database storage.
Functionality:
Stores user queries and chatbot responses in a chat_history table.
Supports retrieval of chat history for authenticated users.


Implementation:
Schema: The chat_history table includes user_id, pdf_id (nullable), question, answer, and created_at fields.
Endpoints:
src/app/api/save-chat/route.ts: Saves chat interactions to Supabase.
src/app/api/get-chats/route.ts: Retrieves chat history for a user.


UI: Displays chat history in a scrollable section on the chatbot page.



Additional Requirements

Code Documentation:
JavaScript/TypeScript code follows ESLint standards with JSDoc comments in API routes and components.
Clear function and component documentation in src/app/chatbot/page.tsx, src/app/api/*, and src/supabase-provider.tsx.


Response File:
Sample user queries and chatbot responses are saved in docs/sample_chat_responses.txt.


GitHub Repository:
All code, including frontend, backend, and database scripts, is hosted in this repository.



Prerequisites

Node.js: Version 18.17 or higher.
Supabase Account: For authentication and database storage.
Gemini API Key: For AI chat functionality.

Setup Instructions
1. Clone the Repository
git clone https://github.com/sahil00016/chatbot-gemini.git
cd chatbot-gemini

2. Install Dependencies
Install Node.js dependencies:
npm install

This installs required packages, including next, @supabase/supabase-js, pdf-parse, and others listed in package.json.
3. Configure Environment Variables
Create a .env.local file in the project root and add the following:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key


Supabase Credentials: Obtain NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase project (Settings > API). Use SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for server-side operations (Settings > API > Service Role Key).
Gemini API Key: Get your API key from the Gemini API dashboard.

4. Set Up Supabase Database

Create a chat_history table in your Supabase project’s SQL Editor:

CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  pdf_id UUID, -- Nullable for AI mode chats
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Make pdf_id nullable
ALTER TABLE chat_history ALTER COLUMN pdf_id DROP NOT NULL;


Enable Row Level Security (RLS) and create a policy to allow authenticated users to access their chat history:

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON chat_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

5. Run the Application Locally

Development Mode:
npm run dev

Open http://localhost:3000 in your browser.

Production Mode:
npm run build
npm start

Open http://localhost:3000.


Usage

Sign In: Navigate to /signin to log in or register using Supabase Auth.
Chatbot Interface (/chatbot):
AI Mode: Select "AI Chat" and type a query to interact with the Gemini AI.
PDF Mode: Select "PDF Chat", upload a PDF file, and ask questions about its content.
Chat History: Click "Load Previous Chats" to view past interactions.


Sign Out: Log out via the Supabase Auth interface.

Sample Responses
Sample user queries and chatbot responses are available in docs/sample_chat_responses.txt.
Project Structure
chatbot-gemini/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse-pdf/route.ts      # PDF parsing endpoint
│   │   │   ├── gemini-chat/route.ts    # Gemini API endpoint
│   │   │   ├── save-chat/route.ts      # Save chat history
│   │   │   ├── get-chats/route.ts      # Retrieve chat history
│   │   ├── chatbot/page.tsx            # Chatbot UI
│   │   ├── signin/page.tsx             # Sign-in page
│   ├── supabase-provider.tsx           # Supabase context provider
├── docs/
│   ├── sample_chat_responses.txt        # Sample queries and responses
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── .env.local                          # Environment variables (not tracked)

Code Documentation

ESLint: Configured in package.json with eslintConfig to enforce JavaScript/TypeScript standards.
JSDoc: All API routes and components include JSDoc comments for clarity.
TypeScript: Strict type checking enabled in tsconfig.json for robust code.

Troubleshooting

Build Errors: Ensure all dependencies are installed (npm install) and environment variables are set.
Supabase Errors: Verify table schema and RLS policies.
Gemini API Errors: Check API key and network connectivity.
PDF Parsing Errors: Ensure uploaded PDFs are valid and pdf-parse is installed.

GitHub Repository
https://github.com/sahil00016/chatbot-gemini
Author
Sahil (sahil00016)

Built as part of an internship assignment, submitted on May 20, 2025.
![chatbot-2](https://github.com/user-attachments/assets/9ee92d69-1400-4b39-8ac3-438d65c51e38)
![chatbot](https://github.com/user-attachments/assets/32181b2d-9048-4655-b0cd-ec11f8f8c908)
