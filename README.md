# Cardano Resolve

A modern landing page for the Cardano Resolve application - simplifying Cardano wallet addresses into memorable aliases.

## Features

- **Modern Design**: Clean, responsive design built with React and Tailwind CSS
- **Component-Based**: Modular, reusable components for scalability
- **shadcn/ui Integration**: Beautiful, accessible UI components
- **TypeScript**: Full type safety and developer experience
- **Responsive**: Mobile-first design that works on all devices

## Components

The landing page is built with the following reusable components:

- `Header` - Navigation bar with logo and sign-in button
- `HeroSection` - Main hero area with search functionality
- `ShortenSection` - Wallet address shortening interface
- `FeaturesSection` - Feature highlights grid
- `Footer` - Site footer with branding

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tool
- **Lucide React** - Icons

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── Header.tsx    # Site header
│   ├── HeroSection.tsx
│   ├── ShortenSection.tsx
│   ├── FeaturesSection.tsx
│   └── Footer.tsx
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main app component
└── main.tsx          # App entry point
```

## Customization

The components are designed to be easily customizable. You can:

- Modify colors and styling in the component files
- Add new sections by creating additional components
- Extend functionality by adding state management
- Integrate with backend APIs for real functionality

## License

MIT License
