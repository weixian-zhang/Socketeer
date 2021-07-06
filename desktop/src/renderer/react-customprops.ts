import React from 'react';

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // extends React's HTMLAttributes
      for?: string;
      rows?: string;
      novalidate?: boolean;
    }
  }