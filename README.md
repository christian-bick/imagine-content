# Imagine Content

## Introduction

Imagine Content is a powerful tool for generating printable, educational worksheets for children. This project provides a flexible and extensible framework for creating a wide variety of math-related exercises, from basic counting to more complex arithmetic problems.

The worksheets are defined programmatically and rendered into HTML, which can then be converted into PDFs for easy printing and distribution.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

Install the dependencies with the packing manager of your choice:

```bash
npm install
```

## Usage

This project uses `vite` for development and `vite-node` to run generation scripts.

### Development Server

To start the development server and view the worksheets in your browser, run:

```bash
npm run dev
```

This will start a local server, and you can navigate to the different worksheet URLs to see them rendered live.

### Generating PDFs

To generate PDF versions of the worksheets, use the `generate` script:

```bash
npm run generate
```

This will create the PDF files in the `dist` directory. To run without creating files, use:
```bash
npm run generate:dry
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
