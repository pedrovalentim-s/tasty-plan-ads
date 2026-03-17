# **App Name**: Tasty Plan - Gerador de Planejamento Estratégico de Tráfego

## Core Features:

- Briefing Upload & AI Parsing: Allows users to upload briefing files (DOCX, TXT, JSON). A generative AI tool analyzes the content to extract key information and auto-fill the strategic planning form.
- Manual Plan Input Form: A user-friendly form for manually entering client details (name, budget, goals, platforms) if no briefing file is provided, or to refine AI-extracted data.
- AI Strategic Plan Generation: Utilizes a generative AI tool to create a complete digital media strategic plan based on form data, detailing campaigns, ad sets, target audiences, creatives, and KPIs.
- Inline Editable Plan Viewer: Displays the generated strategic plan with all content fields editable in-line (text, numbers, lists), providing flexibility for adjustments and customizations.
- Dynamic CRUD for Plan Elements: Enables users to add, remove, and update core components of the plan, such as campaigns, ad sets, strategic notes, and KPIs, directly within the plan view.
- Client Presentation Mode: Switches the plan viewer to a read-only presentation mode, disabling all editing functionalities for a clean and professional client review experience.
- Firebase Backend for Data Management: Integrates with Firebase Firestore for persistent storage of generated plans, Firebase Functions for backend AI processing, and Firebase Storage for handling briefing file uploads.

## Style Guidelines:

- Primary color: Vibrant Purple (#5b48fc) as the main brand color, used for interactive elements, highlights, and key branding.
- Background color: Clean White (#EBEBEB) for main content areas, providing a bright and spacious feel.
- Accent color: Energetic Turquoise (#2cd5d9) to draw attention to call-to-actions and important visual cues, complementing the purple.
- Secondary color (Dark): Black (#000000) for high-contrast text and critical elements.
- Secondary color (Gray): Gray (#878990) for subtle text, borders, and muted elements.
- Headline font: 'Poppins' (geometric sans-serif) for its modern, precise, and contemporary feel, suitable for titles and short, impactful statements.
- Body text font: 'Inter' (grotesque-style sans-serif) for its neutrality, objectivity, and excellent readability, ideal for detailed strategic content and continuous text blocks.
- Utilize icons from 'Lucide React' to provide a consistent, clear, and professional visual language, complementing the app's clean and functional design.
- Implement a responsive, mobile-first design using Tailwind CSS with breakpoint-aware grids (e.g., 4-column desktop, 2-column mobile for summary cards) ensuring optimal viewing across devices.
- Incorporate subtle loading animations, such as 'Sparkles spinning' during AI processing, and smooth transitions for element expansion/collapse to enhance user experience and provide feedback.