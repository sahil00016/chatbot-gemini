Chatbot-Gemini
A Next.js chatbot application with Supabase authentication, Gemini AI integration, PDF parsing, and chat history storage. Built for an internship assignment, it offers AI and PDF-based chat modes with a user-friendly interface.

✨ Features
🔐 User Authentication

Tech: Next.js, Supabase Auth (JWT-based).
Details:
Secure sign-in and sign-out.
Chatbot access restricted to authenticated users.
Redirects unauthenticated users to /signin.


Code: src/supabase-provider.tsx, src/app/chatbot/page.tsx.

🤖 Gemini AI & PDF Parsing

Tech: Next.js API routes, Gemini API, pdf-parse.
Details:
AI Mode: Chat with Gemini AI for general queries.
PDF Mode: Upload PDFs, parse text, and ask questions about content.
Responsive UI with mode switching, PDF upload, and chat input.


Code:
PDF parsing: src/app/api/parse-pdf/route.ts.
Gemini API: src/app/api/gemini-chat/route.ts.
UI: src/app/chatbot/page.tsx (styled with Tailwind CSS).



💾 Chat History Storage

Tech: Supabase (PostgreSQL).
Details:
Stores user queries and responses in chat_history table.
Retrieves chat history for authenticated users.
Scrollable history display in UI.


Code:
Save: src/app/api/save-chat/route.ts.
Retrieve: src/app/api/get-chats/route.ts.



📋 Assignment Requirements

Code Documentation: JSDoc comments and ESLint standards in all routes and components.
Sample Responses: docs/sample_chat_responses.txt with example queries and responses.
GitHub: Full codebase hosted at github.com/sahil00016/chatbot-gemini.


🛠️ Setup
Prerequisites

Node.js (v18.17+)
Supabase account
Gemini API key

1. Clone Repository
git clone https://github.com/sahil00016/chatbot-gemini.git
cd chatbot-gemini

2. Install Dependencies
npm install

3. Configure Environment
Create .env.local:
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key


Supabase: Get keys from Supabase dashboard (Settings > API).
Gemini: Obtain key from Gemini API dashboard.

4. Set Up Supabase Database
Run in Supabase SQL Editor:
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  pdf_id UUID,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE chat_history ALTER COLUMN pdf_id DROP NOT NULL;

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat history" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

5. Run Locally

Development:npm run dev

Visit http://localhost:3000.
Production:npm run build
npm start

Visit http://localhost:3000.


🚀 Usage

Sign In: Go to /signin to log in or register.
Chatbot (/chatbot):
AI Mode: Click "AI Chat" and send queries.
PDF Mode: Click "PDF Chat", upload a PDF, and ask questions.
History: Click "Load Previous Chats" to view past interactions.


Sign Out: Use Supabase Auth to log out.


📂 Project Structure
chatbot-gemini/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse-pdf/route.ts
│   │   │   ├── gemini-chat/route.ts
│   │   │   ├── save-chat/route.ts
│   │   │   ├── get-chats/route.ts
│   │   ├── chatbot/page.tsx
│   │   ├── signin/page.tsx
│   ├── supabase-provider.tsx
├── docs/
│   ├── sample_chat_responses.txt
├── next.config.ts
├── package.json
├── tsconfig.json
├── .env.local


📝 Notes

Documentation: JSDoc in all API routes and components; ESLint configured.
Sample Responses: See docs/sample_chat_responses.txt.
Troubleshooting:
Build issues: Run npm install and check .env.local.
Supabase errors: Verify schema and RLS.
Gemini errors: Confirm API key.
PDF issues: Ensure valid PDFs and pdf-parse installed.




🌐 Repository
github.com/sahil00016/chatbot-gemini
👤 Author
Sahil (sahil00016)
Submitted for internship assignment, May 20, 2025.

![chatbot-2](https://github.com/user-attachments/assets/9ee92d69-1400-4b39-8ac3-438d65c51e38)
![chatbot](https://github.com/user-attachments/assets/32181b2d-9048-4655-b0cd-ec11f8f8c908)
