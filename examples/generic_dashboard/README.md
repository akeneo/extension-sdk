## Project Overview

This React + Vite application serves as a dashboard for visualizing product information from an Akeneo PIM. It features several components that provide insights into product status, completeness, and other key metrics.

### Design System Showcase

This dashboard demonstrates **two different design system implementations** that you can switch between using browser-style tabs at the top of the page:

1. **Akeneo Design System** (default) - The official Akeneo PIM design system, providing a consistent look and feel with the PIM interface.
2. **shadcn/ui** - A modern, accessible component library built with Radix UI and Tailwind CSS.

Both implementations share the same data and functionality, allowing you to compare design approaches and choose the one that best fits your needs.

### Key Features

- **Family Filtering**: Allows users to filter product data by selecting a specific family.
- **Product Status Charts**: Visualizes the distribution of products based on their completeness status and pricing information.
- **Completeness per Locale**: Displays the average completeness score for each locale within the selected family.
- **Product List**: A table that shows recently updated products, including their image, SKU, name, and last update date.

### Libraries and Components

The dashboard is built with a modern stack of UI libraries:

#### Akeneo Design System Implementation
- **UI Components**: Tables, section titles, and helpers from the `akeneo-design-system` package.
- **Styling**: Styled-components with the official Akeneo PIM theme.

#### shadcn/ui Implementation
- **Charts**: Pie charts created using `react-chartjs-2` and `chart.js`.
- **UI Components**: Cards, tables, progress bars, and other components from `shadcn/ui` built with Radix UI primitives.
- **Icons**: Icons provided by `lucide-react`.
- **Styling**: Tailwind CSS with custom design tokens.

#### Shared
- **Data Fetching**: All implementations use the same custom hooks to fetch data from the Akeneo PIM API.
- **Mock Data**: Demo data generation for chart statistics (see `src/hooks/useMockChartData.tsx` for details).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
