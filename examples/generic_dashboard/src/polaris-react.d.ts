/**
 * React JSX Type Declarations for Shopify Polaris Web Components
 *
 * The @shopify/polaris-types package only provides type definitions for Preact.
 * This file extends the React JSX namespace with type-safe definitions for
 * Polaris web components used in this project.
 *
 * Based on official Polaris documentation:
 * https://shopify.dev/docs/api/app-home/polaris-web-components
 */

import type * as React from 'react';

// Type aliases for Polaris spacing values
type SpacingKeyword =
  | 'none'
  | 'small-500'
  | 'small-400'
  | 'small-300'
  | 'small-200'
  | 'small-100'
  | 'small'
  | 'base'
  | 'large'
  | 'large-100'
  | 'large-200'
  | 'large-300'
  | 'large-400'
  | 'large-500';

type MaybeResponsive<T> = T | string; // Simplified - actual type supports responsive values

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // ==================== Layout Components ====================

      /**
       * Stack - Organizes elements horizontally or vertically
       * @see https://shopify.dev/docs/api/app-home/polaris-web-components/structure/stack
       */
      's-stack': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /**
           * Sets how the Stack's children are placed within the Stack
           * - 'block': vertical layout (default)
           * - 'inline': horizontal layout
           */
          direction?: MaybeResponsive<'block' | 'inline'>;

          /**
           * Sets the amount of space between children
           * Accepts spacing keywords or responsive values
           */
          gap?: MaybeResponsive<SpacingKeyword>;

          /**
           * Controls child alignment along block axis
           */
          alignItems?: MaybeResponsive<'start' | 'center' | 'end' | 'stretch'>;

          /**
           * Distributes space along block axis
           */
          alignContent?: MaybeResponsive<'start' | 'center' | 'end' | 'space-between' | 'space-around'>;

          /**
           * Aligns children along inline axis
           */
          justifyContent?: MaybeResponsive<'start' | 'center' | 'end' | 'space-between' | 'space-around'>;

          /**
           * Whether children should wrap
           */
          wrap?: boolean;
        },
        HTMLElement
      >;

      /**
       * Section - Groups related content into clearly-defined thematic areas
       * @see https://shopify.dev/docs/api/app-home/polaris-web-components/structure/section
       */
      's-section': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /**
           * A title that describes the content of the section
           */
          heading?: string;

          /**
           * A label used to describe the section for assistive technologies
           * Required when no heading is provided
           */
          accessibilityLabel?: string;

          /**
           * Padding configuration
           * - 'base': Applies contextually appropriate padding (default)
           * - 'none': Removes all padding
           */
          padding?: 'base' | 'none';
        },
        HTMLElement
      >;

      /**
       * Page - Top-level container for app content
       */
      's-page': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          subtitle?: string;
          primaryAction?: string;
          secondaryActions?: string;
        },
        HTMLElement
      >;

      /**
       * Grid - CSS Grid layout container
       */
      's-grid': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          columns?: string | number;
          gap?: MaybeResponsive<SpacingKeyword>;
          areas?: string;
        },
        HTMLElement
      >;

      // ==================== Table Components ====================

      /**
       * Table - Displays data in rows and columns
       * @see https://shopify.dev/docs/api/app-home/polaris-web-components/tables/table
       */
      's-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /**
           * Reduces padding for a more compact table
           */
          condensed?: boolean;

          /**
           * Adds hover effect to rows
           */
          hoverable?: boolean;

          /**
           * Adds alternating row background colors
           */
          striped?: boolean;
        },
        HTMLElement
      >;

      /**
       * Table Header - Container for table header content
       */
      's-table-header': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      /**
       * Table Header Row - Row within the table header
       */
      's-table-header-row': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      /**
       * Table Body - Container for table body rows
       */
      's-table-body': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      /**
       * Table Row - Single row in the table
       */
      's-table-row': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /**
           * Whether the row is selected
           */
          selected?: boolean;

          /**
           * Whether the row is disabled
           */
          disabled?: boolean;
        },
        HTMLElement
      >;

      /**
       * Table Cell - Single cell in a table row
       */
      's-table-cell': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /**
           * Horizontal alignment of cell content
           */
          alignment?: 'start' | 'center' | 'end';

          /**
           * Vertical alignment of cell content
           */
          verticalAlignment?: 'top' | 'middle' | 'bottom';
        },
        HTMLElement
      >;

      /**
       * Table Footer - Container for table footer content
       */
      's-table-footer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      // ==================== Typography Components ====================

      /**
       * Text - Displays text with various styles
       */
      's-text': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'headingXl' | 'headingLg' | 'headingMd' | 'headingSm' | 'headingXs' | 'bodyLg' | 'bodyMd' | 'bodySm';
          as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
          alignment?: 'start' | 'center' | 'end' | 'justify';
          fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
          tone?: 'base' | 'subdued' | 'success' | 'critical' | 'warning' | 'info';
        },
        HTMLElement
      >;

      /**
       * Heading - Semantic heading element
       */
      's-heading': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        },
        HTMLElement
      >;

      // ==================== Form Components ====================

      /**
       * Button - Interactive button element
       */
      's-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary' | 'tertiary' | 'plain';
          size?: 'slim' | 'medium' | 'large';
          disabled?: boolean;
          loading?: boolean;
          fullWidth?: boolean;
          textAlign?: 'left' | 'center' | 'right';
          icon?: string;
          tone?: 'success' | 'critical';
        },
        HTMLElement
      >;

      /**
       * Text Field - Input field for text
       */
      's-text-field': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          value?: string;
          placeholder?: string;
          disabled?: boolean;
          error?: string;
          helpText?: string;
          type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url';
          multiline?: boolean;
          rows?: number;
        },
        HTMLElement
      >;

      /**
       * Select - Dropdown selection field
       */
      's-select': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          value?: string;
          disabled?: boolean;
          error?: string;
          helpText?: string;
          placeholder?: string;
        },
        HTMLElement
      >;

      /**
       * Checkbox - Checkbox input
       */
      's-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          checked?: boolean;
          disabled?: boolean;
          error?: string;
          helpText?: string;
        },
        HTMLElement
      >;

      // ==================== UI Components ====================

      /**
       * Card - Container for grouping related content
       */
      's-card': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          sectioned?: boolean;
          subdued?: boolean;
        },
        HTMLElement
      >;

      /**
       * Card Section - Section within a card
       */
      's-card-section': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          subdued?: boolean;
        },
        HTMLElement
      >;

      /**
       * Banner - Displays important messages
       */
      's-banner': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          status?: 'success' | 'info' | 'warning' | 'critical';
          dismissible?: boolean;
        },
        HTMLElement
      >;

      /**
       * Badge - Small status indicator
       */
      's-badge': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          status?: 'success' | 'info' | 'attention' | 'warning' | 'critical' | 'new';
          progress?: 'incomplete' | 'partiallyComplete' | 'complete';
          size?: 'small' | 'medium';
        },
        HTMLElement
      >;

      /**
       * List - Displays a list of items
       */
      's-list': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          type?: 'bullet' | 'number';
          gap?: MaybeResponsive<SpacingKeyword>;
        },
        HTMLElement
      >;

      /**
       * List Item - Single item in a list
       */
      's-list-item': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;

      /**
       * Divider - Visual separator
       */
      's-divider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          borderColor?: string;
        },
        HTMLElement
      >;

      /**
       * Spinner - Loading indicator
       */
      's-spinner': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          size?: 'small' | 'large';
          accessibilityLabel?: string;
        },
        HTMLElement
      >;

      /**
       * Modal - Dialog overlay
       */
      's-modal': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          open?: boolean;
          title?: string;
          primaryAction?: string;
          secondaryActions?: string;
          large?: boolean;
        },
        HTMLElement
      >;

      /**
       * Tooltip - Contextual help text
       */
      's-tooltip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          content?: string;
          preferredPosition?: 'above' | 'below';
          active?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

// Ensure this file is treated as a module
export {};
