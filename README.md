# Favicon Generator

A modern web application built with Next.js and TypeScript that allows users to generate favicons in multiple formats and sizes from uploaded images. This tool simplifies the process of creating favicon packages for websites.

## Features

- 🖼️ Upload images and convert them to favicons
- 🎨 Generate multiple favicon formats (ICO, PNG)
- 📏 Automatic resizing for different device requirements
- 📦 Download all favicons as a ZIP package
- 🌓 Dark/Light mode support
- 🎯 Drag and drop file upload
- 📱 Responsive design
- ♿ Accessibility features

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation
- [File-Saver](https://github.com/eligrey/FileSaver.js/) - File downloading
- [React-Dropzone](https://react-dropzone.js.org/) - Drag and drop functionality

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/favicon-generator.git
cd favicon-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Visit the website
2. Upload an image by dragging and dropping or clicking the upload area
3. Wait for the favicons to be generated
4. Download the ZIP package containing all favicon files
5. Extract the ZIP file and use the favicons in your web project

## Build

To build the project for production:

```bash
npm run build
# or
yarn build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern web technologies
- Inspired by the need for a simple, efficient favicon generator
- UI components from Shadcn/ui
- Icons from Lucide React
