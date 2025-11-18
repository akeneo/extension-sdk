## Project Overview

This React + Vite application serves as a dashboard for visualizing product information from an Akeneo PIM. It features several components that provide insights into product status, completeness, and other key metrics.

### Key Features

- **Family Filtering**: Allows users to filter product data by selecting a specific family.
- **Product Status Charts**: Visualizes the distribution of products based on their completeness status and pricing information using pie charts.
- **Completeness per Locale**: Displays the average completeness score for each locale within the selected family.
- **Product List**: A table that shows recently updated products, including their image, SKU, name, and last update date.
- **Workflow Tasks**: A table that lists overdue workflow tasks.

### Libraries and Components

The dashboard is built with a modern stack of UI libraries to create a clean and interactive user experience:

- **Charts**: The pie charts for product and pricing status are created using `react-chartjs-2`, a React wrapper for the popular `chart.js` library.
- **UI Components**: The card blocks, tables, progress bars, and badges are implemented using `shadcn/ui`, which provides a set of accessible and customizable components.
- **Icons**: Icons throughout the application are provided by `lucide-react`, a lightweight and flexible icon library.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
