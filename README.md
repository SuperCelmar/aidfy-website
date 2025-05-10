# AutomationDFY - AI Marketing Solutions Landing Page

This project is a single-screen landing page for AutomationDFY, designed to showcase AI marketing solutions and features an embedded Voiceflow chatbot.

## Positioning
Unlocking new channels with AI marketing solutions.

## Audience
Founders and Marketing Managers.

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4 (Utility Classes)
- Voiceflow Web SDK

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

### 1. Clone the repository (if applicable)
```bash
git clone <your-repo-url>
cd automationdfy-landing
```

### 2. Create Environment Variables
Create a `.env.local` file in the root of your project and add your Voiceflow credentials:

```
NEXT_PUBLIC_VOICEFLOW_VERSION_ID=YOUR_ACTUAL_VERSION_ID
NEXT_PUBLIC_VOICEFLOW_API_KEY=YOUR_ACTUAL_API_KEY
```
Replace `YOUR_ACTUAL_VERSION_ID` and `YOUR_ACTUAL_API_KEY` with your real credentials from Voiceflow.

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Add Placeholder Image
Place an image named `placeholder-image.jpg` in the `public/` directory. This image will be displayed in the hero section. You can replace this with any image you prefer and update the path in `components/Hero.tsx` if needed. Consider using the Next.js `<Image>` component for better optimization.

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the core application logic, pages, and layouts (App Router).
  - `layout.tsx`: Main HTML layout.
  - `page.tsx`: The single landing page.
  - `globals.css`: Global styles and Tailwind directives.
- `components/`: Contains reusable React components.
  - `Header.tsx`: Site header.
  - `Footer.tsx`: Site footer.
  - `Hero.tsx`: Hero section containing the chatbot and initial content.
  - `Chatbot.tsx`: Client component for Voiceflow SDK integration and chat UI.
- `public/`: Static assets.
  - `placeholder-image.jpg`: Image for the hero section.
- `.env.local`: Environment variables (ignored by Git).
- `tailwind.config.ts`: Tailwind CSS configuration.
- `next.config.mjs`: Next.js configuration (if needed for advanced settings).
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.

## Customization

- **Styling**: Modify `tailwind.config.ts` to adjust theme colors, fonts, etc. Utility classes are used directly in components.
- **Chatbot Behavior**: Update `components/Chatbot.tsx` for any changes to the Voiceflow integration or chat UI interactions.
- **Content**: Edit text directly within the components, primarily in `components/Hero.tsx` for the initial view and `components/Chatbot.tsx` for chat-specific text.

## Primary CTA
- The primary call to action is to interact with the chatbot.
- Secondary CTAs include "Book a demo" link and an email link in the hero section, and a "Book a demo" button in the header. # aidfy-website
# aidfy-website
