"use client";

import React, { useEffect, useRef, useState } from "react";

interface PreviewFrameProps {
  code: string;
  onError?: (error: string) => void;
}

export function PreviewFrame({ code, onError }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code || !iframeRef.current) return;

    setIsLoading(true);

    // Create the preview HTML with all components bundled
    const previewHTML = generatePreviewHTML(code);

    // Set srcdoc instead of using doc.write (more reliable)
    const iframe = iframeRef.current;
    iframe.srcdoc = previewHTML;

    // Listen for errors from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "preview-error") {
        onError?.(event.data.message);
        setIsLoading(false);
      }
      if (event.data?.type === "preview-ready") {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    // Fallback: Set loading false after a timeout
    const timeout = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeout);
    };
  }, [code, onError]);

  return (
    <div className="relative h-full min-h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Rendering preview...</span>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full min-h-[400px] border-0"
        sandbox="allow-scripts allow-same-origin"
        title="UI Preview"
      />
    </div>
  );
}

function generatePreviewHTML(code: string): string {
  // Extract just the component body for inline rendering
  // This is a simplified approach - in production you'd use a proper bundler

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #root { min-height: 100vh; }
    .preview-loading { padding: 20px; text-align: center; color: #666; }
    .preview-error { padding: 20px; color: #dc2626; }

    /* Tailwind-like utility classes */
    .min-h-screen { min-height: 100vh; }
    .bg-gray-50 { background-color: #f9fafb; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .bg-white { background-color: #ffffff; }
    .bg-blue-50 { background-color: #eff6ff; }
    .bg-blue-100 { background-color: #dbeafe; }
    .bg-blue-600 { background-color: #2563eb; }
    .bg-blue-700 { background-color: #1d4ed8; }
    .bg-green-50 { background-color: #f0fdf4; }
    .bg-green-100 { background-color: #dcfce7; }
    .bg-green-600 { background-color: #16a34a; }
    .bg-yellow-50 { background-color: #fefce8; }
    .bg-yellow-100 { background-color: #fef9c3; }
    .bg-red-50 { background-color: #fef2f2; }
    .bg-red-100 { background-color: #fee2e2; }
    .bg-red-600 { background-color: #dc2626; }
    .bg-red-700 { background-color: #b91c1c; }
    .bg-gray-500 { background-color: #6b7280; }
    .bg-gray-600 { background-color: #4b5563; }
    .bg-purple-600 { background-color: #9333ea; }
    .bg-cyan-600 { background-color: #0891b2; }
    .bg-black\\/50 { background-color: rgba(0,0,0,0.5); }

    .text-white { color: #ffffff; }
    .text-gray-400 { color: #9ca3af; }
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    .text-gray-900 { color: #111827; }
    .text-blue-600 { color: #2563eb; }
    .text-blue-800 { color: #1e40af; }
    .text-green-600 { color: #16a34a; }
    .text-green-800 { color: #166534; }
    .text-yellow-800 { color: #854d0e; }
    .text-red-600 { color: #dc2626; }
    .text-red-800 { color: #991b1b; }

    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

    .font-normal { font-weight: 400; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }

    .uppercase { text-transform: uppercase; }
    .tracking-wider { letter-spacing: 0.05em; }
    .text-left { text-align: left; }
    .text-center { text-align: center; }

    .p-1 { padding: 0.25rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-6 { padding: 1.5rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .px-8 { padding-left: 2rem; padding-right: 2rem; }
    .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }

    .m-0 { margin: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mb-1 { margin-top: 0.25rem; }
    .mb-4 { margin-bottom: 1rem; }
    .ml-1 { margin-left: 0.25rem; }
    .mx-4 { margin-left: 1rem; margin-right: 1rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
    .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
    .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }

    .flex { display: flex; }
    .inline-flex { display: inline-flex; }
    .grid { display: grid; }
    .hidden { display: none; }
    .block { display: block; }
    .inline-block { display: inline-block; }

    .flex-row { flex-direction: row; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }

    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .items-stretch { align-items: stretch; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }

    .gap-1 { gap: 0.25rem; }
    .gap-1\\.5 { gap: 0.375rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }
    .gap-8 { gap: 2rem; }

    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

    .w-full { width: 100%; }
    .w-8 { width: 2rem; }
    .w-10 { width: 2.5rem; }
    .w-12 { width: 3rem; }
    .w-16 { width: 4rem; }
    .w-64 { width: 16rem; }
    .w-px { width: 1px; }
    .max-w-sm { max-width: 24rem; }
    .max-w-md { max-width: 28rem; }
    .max-w-lg { max-width: 32rem; }
    .max-w-2xl { max-width: 42rem; }
    .max-w-4xl { max-width: 56rem; }
    .max-w-6xl { max-width: 72rem; }
    .max-w-full { max-width: 100%; }
    .min-w-\\[160px\\] { min-width: 160px; }

    .h-full { height: 100%; }
    .h-8 { height: 2rem; }
    .h-10 { height: 2.5rem; }
    .h-12 { height: 3rem; }
    .h-64 { height: 16rem; }
    .h-px { height: 1px; }

    .rounded { border-radius: 0.25rem; }
    .rounded-md { border-radius: 0.375rem; }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }
    .rounded-full { border-radius: 9999px; }

    .border { border-width: 1px; }
    .border-0 { border-width: 0; }
    .border-2 { border-width: 2px; }
    .border-b { border-bottom-width: 1px; }
    .border-b-2 { border-bottom-width: 2px; }
    .border-l-4 { border-left-width: 4px; }
    .border-r { border-right-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-blue-600 { border-color: #2563eb; }
    .border-green-600 { border-color: #16a34a; }
    .border-yellow-600 { border-color: #ca8a04; }
    .border-red-600 { border-color: #dc2626; }
    .border-transparent { border-color: transparent; }

    .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }

    .overflow-x-auto { overflow-x: auto; }
    .overflow-hidden { overflow: hidden; }
    .object-cover { object-fit: cover; }

    .fixed { position: fixed; }
    .absolute { position: absolute; }
    .relative { position: relative; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .top-full { top: 100%; }
    .left-0 { left: 0; }
    .z-50 { z-index: 50; }

    .cursor-pointer { cursor: pointer; }
    .cursor-not-allowed { cursor: not-allowed; }
    .opacity-50 { opacity: 0.5; }
    .transition-all { transition: all 0.15s ease; }
    .transition-colors { transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease; }
    .transition-transform { transition: transform 0.15s ease; }
    .rotate-180 { transform: rotate(180deg); }

    .space-y-1 > * + * { margin-top: 0.25rem; }

    .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
    .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
    .hover\\:bg-gray-100:hover { background-color: #f3f4f6; }
    .hover\\:bg-gray-200:hover { background-color: #e5e7eb; }
    .hover\\:bg-gray-600:hover { background-color: #4b5563; }
    .hover\\:bg-red-700:hover { background-color: #b91c1c; }
    .hover\\:bg-blue-600:hover { background-color: #2563eb; }
    .hover\\:text-white:hover { color: #ffffff; }
    .hover\\:text-gray-700:hover { color: #374151; }
    .hover\\:text-gray-900:hover { color: #111827; }

    .focus\\:outline-none:focus { outline: none; }
    .focus\\:ring-2:focus { box-shadow: 0 0 0 2px #3b82f6; }
    .focus\\:ring-blue-500:focus { box-shadow: 0 0 0 2px #3b82f6; }

    @media (min-width: 768px) {
      .md\\:flex { display: flex; }
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  </style>
</head>
<body>
  <div id="root"><div class="preview-loading">Loading preview...</div></div>

  <script>
    window.onerror = function(msg, url, line) {
      console.error('Script error:', msg, url, line);
      document.getElementById('root').innerHTML = '<div class="preview-error">Error: ' + msg + '</div>';
      window.parent.postMessage({ type: 'preview-error', message: msg }, '*');
      return true;
    };
  </script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <script type="text/babel">
    console.log('Babel script starting, React available:', typeof React !== 'undefined');
    const { useState, useEffect, useRef } = React;

    // ===== COMPONENT LIBRARY =====

    ${getComponentLibraryCode()}

    // ===== USER GENERATED CODE =====

    console.log('Preview: Starting to render user code...');

    try {
      ${transformUserCode(code)}

      console.log('Preview: Code parsed, GeneratedUI type:', typeof GeneratedUI);

      if (typeof GeneratedUI === 'undefined') {
        throw new Error('GeneratedUI component is not defined. Check your export.');
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(GeneratedUI));

      window.parent.postMessage({ type: 'preview-ready' }, '*');
    } catch (error) {
      console.error('Preview error:', error);
      window.parent.postMessage({ type: 'preview-error', message: error.message }, '*');
      document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #dc2626;"><strong>Render Error:</strong> ' + error.message + '</div>';
    }

    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
      console.error('Global error:', message);
      window.parent.postMessage({ type: 'preview-error', message: String(message) }, '*');
      document.getElementById('root').innerHTML = '<div class="preview-error"><strong>Error:</strong> ' + message + '</div>';
      return true;
    };
  </script>

  <script>
    // Fallback: Check if Babel processed the script after a short delay
    setTimeout(function() {
      var root = document.getElementById('root');
      if (root && root.innerHTML.includes('Loading preview')) {
        console.error('Babel may not have processed the script');
        root.innerHTML = '<div class="preview-error">Preview failed to load. Check browser console for errors.</div>';
        window.parent.postMessage({ type: 'preview-ready' }, '*');
      }
    }, 3000);
  </script>
</body>
</html>
`;
}

function transformUserCode(code: string): string {
  // Remove the import statements since components are already available
  let transformed = code
    // Remove @/components/ui imports
    .replace(/import\s*\{[^}]+\}\s*from\s*["']@\/components\/ui["'];?\s*/g, "")
    // Remove react imports
    .replace(/import\s*\{[^}]+\}\s*from\s*["']react["'];?\s*/g, "")
    .replace(/import\s+React\s*,?\s*\{[^}]*\}\s*from\s*["']react["'];?\s*/g, "")
    .replace(/import\s+React\s+from\s*["']react["'];?\s*/g, "")
    // Remove any other imports that might cause issues
    .replace(/import\s+.*from\s*["'][^"']+["'];?\s*/g, "");

  // Handle different export patterns
  // export default function ComponentName() { ... }
  transformed = transformed.replace(
    /export\s+default\s+function\s+\w+\s*\(/g,
    "const GeneratedUI = function("
  );
  // export default function() { ... }
  transformed = transformed.replace(
    /export\s+default\s+function\s*\(/g,
    "const GeneratedUI = function("
  );
  // export default () => { ... }
  transformed = transformed.replace(
    /export\s+default\s+\(\s*\)\s*=>/g,
    "const GeneratedUI = () =>"
  );
  // const X = ...; export default X;
  transformed = transformed.replace(
    /export\s+default\s+(\w+)\s*;?$/gm,
    "const GeneratedUI = $1;"
  );

  // Clean up multiple newlines
  transformed = transformed.replace(/\n{3,}/g, "\n\n").trim();

  return transformed;
}

function getComponentLibraryCode(): string {
  return `
// Button Component
function Button({ variant = "primary", size = "md", disabled = false, onClick, children }) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    transition: "all 0.2s ease",
    boxShadow: variant === "primary" ? "0 2px 4px rgba(37, 99, 235, 0.2)" : "none"
  };
  const variantStyles = {
    primary: { backgroundColor: "#2563eb", color: "#fff" },
    secondary: { backgroundColor: "#f3f4f6", color: "#374151" },
    outline: { backgroundColor: "transparent", color: "#2563eb", border: "2px solid #2563eb" },
    danger: { backgroundColor: "#dc2626", color: "#fff", boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)" },
    ghost: { backgroundColor: "transparent", color: "#4b5563" },
  };
  const sizeStyles = {
    sm: { padding: "8px 16px", fontSize: "14px" },
    md: { padding: "10px 20px", fontSize: "15px" },
    lg: { padding: "14px 28px", fontSize: "16px" },
  };
  const style = { ...baseStyle, ...(variantStyles[variant] || variantStyles.primary), ...(sizeStyles[size] || sizeStyles.md) };
  return React.createElement("button", { onClick, disabled, style }, children);
}

// Card Component
function Card({ title, subtitle, children, padding = "md" }) {
  const paddingValues = { sm: "16px", md: "24px", lg: "32px" };
  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    padding: paddingValues[padding] || paddingValues.md,
    transition: "box-shadow 0.2s ease"
  };
  return React.createElement("div", { style: cardStyle }, [
    (title || subtitle) && React.createElement("div", { key: "header", style: { marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #f3f4f6" } }, [
      title && React.createElement("h3", { key: "title", style: { fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0, letterSpacing: "-0.02em" } }, title),
      subtitle && React.createElement("p", { key: "subtitle", style: { fontSize: "14px", color: "#6b7280", marginTop: "6px", margin: 0 } }, subtitle)
    ]),
    children
  ]);
}

// Input Component
function Input({ label, placeholder, type = "text", required = false, helperText, value, onChange }) {
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px" } }, [
    label && React.createElement("label", { key: "label", style: { fontSize: "14px", fontWeight: "500", color: "#111827" } }, [
      label,
      required && React.createElement("span", { key: "req", style: { color: "#dc2626", marginLeft: "4px" } }, "*")
    ]),
    React.createElement("input", {
      key: "input",
      type,
      placeholder,
      required,
      value,
      onChange,
      style: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        fontSize: "16px",
        color: "#111827",
        outline: "none"
      }
    }),
    helperText && React.createElement("span", { key: "helper", style: { fontSize: "12px", color: "#6b7280" } }, helperText)
  ]);
}

// Table Component
function Table({ columns = [], data = [], striped = false }) {
  return React.createElement("div", { style: { overflowX: "auto", borderRadius: "8px", border: "1px solid #e5e7eb" } },
    React.createElement("table", { style: { width: "100%", borderCollapse: "collapse" } }, [
      React.createElement("thead", { key: "head", style: { backgroundColor: "#f9fafb" } },
        React.createElement("tr", {}, columns.map((col, i) =>
          React.createElement("th", { key: i, style: { padding: "12px 16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#111827", borderBottom: "1px solid #e5e7eb" } }, col.header)
        ))
      ),
      React.createElement("tbody", { key: "body" }, data.map((row, ri) =>
        React.createElement("tr", {
          key: ri,
          style: { backgroundColor: striped && ri % 2 === 1 ? "#f9fafb" : "#fff" }
        }, columns.map((col, ci) =>
          React.createElement("td", { key: ci, style: { padding: "12px 16px", fontSize: "14px", color: "#4b5563", borderBottom: "1px solid #e5e7eb" } }, row[col.key])
        ))
      ))
    ])
  );
}

// Modal Component
function Modal({ title, isOpen, onClose, children, size = "md" }) {
  if (!isOpen) return null;
  const sizeWidths = { sm: "380px", md: "480px", lg: "600px" };
  return React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" } }, [
    React.createElement("div", { key: "overlay", style: { position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }, onClick: onClose }),
    React.createElement("div", { key: "modal", style: { position: "relative", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", width: "100%", maxWidth: sizeWidths[size] || sizeWidths.md, margin: "16px" } }, [
      React.createElement("div", { key: "header", style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #e5e7eb" } }, [
        React.createElement("h2", { key: "title", style: { fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 } }, title),
        React.createElement("button", { key: "close", onClick: onClose, style: { padding: "4px 8px", borderRadius: "6px", border: "none", background: "none", cursor: "pointer", fontSize: "18px" } }, "✕")
      ]),
      React.createElement("div", { key: "body", style: { padding: "16px" } }, children)
    ])
  ]);
}

// Sidebar Component
function Sidebar({ items = [], collapsed = false, title }) {
  return React.createElement("aside", {
    style: { backgroundColor: "#f9fafb", borderRight: "1px solid #e5e7eb", height: "100%", width: collapsed ? "64px" : "256px", transition: "width 0.2s" }
  }, [
    title && !collapsed && React.createElement("div", { key: "title", style: { padding: "16px", borderBottom: "1px solid #e5e7eb" } },
      React.createElement("h2", { style: { fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 } }, title)
    ),
    React.createElement("nav", { key: "nav", style: { padding: "8px" } },
      React.createElement("ul", { style: { listStyle: "none", margin: 0, padding: 0 } }, items.map((item, i) =>
        React.createElement("li", { key: i, style: { marginBottom: "4px" } },
          React.createElement("a", {
            href: "#",
            onClick: (e) => e.preventDefault(),
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
              color: item.active ? "#fff" : "#4b5563",
              backgroundColor: item.active ? "#2563eb" : "transparent",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }
          }, [
            item.icon && React.createElement("span", { key: "icon" }, item.icon),
            !collapsed && React.createElement("span", { key: "label" }, item.label)
          ])
        )
      ))
    )
  ]);
}

// Navbar Component
function Navbar({ brand, items = [], actions }) {
  return React.createElement("header", { style: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 32px",
    position: "sticky",
    top: 0,
    zIndex: 40,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  } },
    React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" } }, [
      React.createElement("div", { key: "left", style: { display: "flex", alignItems: "center", gap: "48px" } }, [
        React.createElement("h1", { key: "brand", style: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: 0, letterSpacing: "-0.02em" } }, brand),
        items.length > 0 && React.createElement("nav", { key: "nav", style: { display: "flex", alignItems: "center", gap: "8px" } },
          items.map((item, i) => React.createElement("a", {
            key: i,
            href: "#",
            onClick: (e) => e.preventDefault(),
            style: {
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "500",
              textDecoration: "none",
              color: item.active ? "#2563eb" : "#4b5563",
              backgroundColor: item.active ? "#eff6ff" : "transparent",
              transition: "all 0.15s ease",
              cursor: "pointer"
            }
          }, item.label))
        )
      ]),
      actions && React.createElement("div", { key: "actions", style: { display: "flex", alignItems: "center", gap: "12px" } }, actions)
    ])
  );
}

// Chart Component (simplified without Recharts)
function Chart({ type, data, title }) {
  const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#06b6d4"];
  const maxValue = data && data.length > 0 ? Math.max(...data.map(d => d.value || 0)) : 100;

  const renderBarChart = () => {
    if (!data || data.length === 0) return null;
    return React.createElement("div", {
      style: { display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: "200px", gap: "8px", padding: "0 16px" }
    }, data.map((item, i) =>
      React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1 } }, [
        React.createElement("div", {
          key: "bar",
          style: {
            width: "100%",
            maxWidth: "60px",
            height: ((item.value / maxValue) * 180) + "px",
            backgroundColor: COLORS[i % COLORS.length],
            borderRadius: "4px 4px 0 0",
            transition: "height 0.3s"
          }
        }),
        React.createElement("span", { key: "label", style: { fontSize: "12px", color: "#6b7280", marginTop: "8px", textAlign: "center" } }, item.name)
      ])
    ));
  };

  const renderLineChart = () => {
    if (!data || data.length < 2) return null;
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d.value / maxValue) * 100)
    }));
    const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");

    return React.createElement("div", { style: { position: "relative", height: "200px", padding: "16px" } }, [
      React.createElement("svg", { key: "svg", viewBox: "0 0 100 100", style: { width: "100%", height: "160px" }, preserveAspectRatio: "none" }, [
        React.createElement("path", { key: "line", d: pathD, fill: "none", stroke: "#2563eb", strokeWidth: "2" })
      ]),
      React.createElement("div", { key: "labels", style: { display: "flex", justifyContent: "space-between", marginTop: "8px" } },
        data.map((item, i) => React.createElement("span", { key: i, style: { fontSize: "12px", color: "#6b7280" } }, item.name))
      )
    ]);
  };

  const renderPieChart = () => {
    if (!data || data.length === 0) return null;
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

    return React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", height: "200px" } }, [
      React.createElement("div", { key: "legend", style: { display: "flex", flexDirection: "column", gap: "8px" } },
        data.map((item, i) =>
          React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: "8px" } }, [
            React.createElement("div", { key: "dot", style: { width: "12px", height: "12px", borderRadius: "50%", backgroundColor: COLORS[i % COLORS.length] } }),
            React.createElement("span", { key: "text", style: { fontSize: "14px", color: "#374151" } },
              item.name + ": " + Math.round((item.value / total) * 100) + "%"
            )
          ])
        )
      )
    ]);
  };

  const renderChart = () => {
    switch(type) {
      case "bar": return renderBarChart();
      case "line": return renderLineChart();
      case "area": return renderLineChart();
      case "pie": return renderPieChart();
      default: return React.createElement("div", { style: { padding: "20px", color: "#6b7280", textAlign: "center" } }, "Chart type: " + type);
    }
  };

  return React.createElement("div", { className: "w-full" }, [
    title && React.createElement("h3", { key: "title", className: "text-lg font-semibold text-gray-900 mb-4" }, title),
    React.createElement("div", { key: "chart", style: { backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" } }, renderChart())
  ]);
}

// Badge Component
function Badge({ text, variant = "info" }) {
  const variantStyles = {
    info: { backgroundColor: "#dbeafe", color: "#1e40af" },
    success: { backgroundColor: "#dcfce7", color: "#166534" },
    warning: { backgroundColor: "#fef9c3", color: "#854d0e" },
    error: { backgroundColor: "#fee2e2", color: "#991b1b" }
  };
  const style = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    ...(variantStyles[variant] || variantStyles.info)
  };
  return React.createElement("span", { style }, text);
}

// Avatar Component
function Avatar({ name = "User", size = "md", src }) {
  const sizeValues = { sm: 32, md: 40, lg: 48 };
  const fontSizes = { sm: "12px", md: "14px", lg: "16px" };
  const colors = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#9333ea", "#0891b2"];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const initials = name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
  const sz = sizeValues[size] || sizeValues.md;

  if (src) {
    return React.createElement("img", { src, alt: name, style: { width: sz, height: sz, borderRadius: "50%", objectFit: "cover" } });
  }
  return React.createElement("div", {
    style: { width: sz, height: sz, backgroundColor: colors[colorIndex], borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "500", fontSize: fontSizes[size] }
  }, initials);
}

// Tabs Component
function Tabs({ items = [], defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || (items.length > 0 ? items[0].id : null));
  const activeContent = items.find(item => item.id === activeTab);

  if (!items.length) return null;

  return React.createElement("div", { style: { width: "100%" } }, [
    React.createElement("div", { key: "tabs", style: { display: "flex", borderBottom: "1px solid #e5e7eb" } },
      items.map(item => React.createElement("button", {
        key: item.id,
        onClick: () => setActiveTab(item.id),
        style: {
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          border: "none",
          background: "none",
          cursor: "pointer",
          borderBottom: activeTab === item.id ? "2px solid #2563eb" : "2px solid transparent",
          color: activeTab === item.id ? "#2563eb" : "#6b7280",
          marginBottom: "-1px"
        }
      }, item.label))
    ),
    React.createElement("div", { key: "content", style: { padding: "16px 0" } }, activeContent && activeContent.content)
  ]);
}

// Alert Component
function Alert({ type = "info", title, message, dismissible = false, onDismiss }) {
  const typeStyles = {
    info: { bg: "#eff6ff", border: "#2563eb", text: "#1e40af" },
    success: { bg: "#f0fdf4", border: "#16a34a", text: "#166534" },
    warning: { bg: "#fefce8", border: "#ca8a04", text: "#854d0e" },
    error: { bg: "#fef2f2", border: "#dc2626", text: "#991b1b" }
  };
  const icons = { info: "ℹ️", success: "✓", warning: "⚠️", error: "✕" };
  const styles = typeStyles[type] || typeStyles.info;

  return React.createElement("div", { style: { display: "flex", gap: "12px", padding: "16px", borderRadius: "8px", borderLeft: "4px solid " + styles.border, backgroundColor: styles.bg } }, [
    React.createElement("span", { key: "icon" }, icons[type]),
    React.createElement("div", { key: "content", style: { flex: 1 } }, [
      title && React.createElement("h4", { key: "title", style: { fontWeight: "600", marginBottom: "4px", color: styles.text, margin: 0 } }, title),
      React.createElement("p", { key: "message", style: { fontSize: "14px", color: styles.text, margin: 0 } }, message)
    ]),
    dismissible && React.createElement("button", { key: "dismiss", onClick: onDismiss, style: { color: styles.text, background: "none", border: "none", cursor: "pointer" } }, "✕")
  ]);
}

// Dropdown Component
function Dropdown({ label, items = [], variant = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    border: variant === "outline" ? "2px solid #e5e7eb" : "none",
    backgroundColor: variant === "outline" ? "transparent" : "#f3f4f6",
    color: "#111827"
  };

  return React.createElement("div", { style: { position: "relative", display: "inline-block" } }, [
    React.createElement("button", {
      key: "trigger",
      onClick: () => setIsOpen(!isOpen),
      style: buttonStyle
    }, [label, React.createElement("span", { key: "arrow", style: { transition: "transform 0.15s", transform: isOpen ? "rotate(180deg)" : "none" } }, "▼")]),
    isOpen && React.createElement("div", {
      key: "menu",
      style: { position: "absolute", top: "100%", left: 0, marginTop: "4px", minWidth: "160px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", padding: "4px 0", zIndex: 50 }
    }, items.map((item, i) => React.createElement("button", {
      key: i,
      onClick: () => { item.onClick && item.onClick(); setIsOpen(false); },
      style: { width: "100%", padding: "8px 16px", textAlign: "left", fontSize: "14px", color: "#4b5563", background: "none", border: "none", cursor: "pointer" }
    }, item.label)))
  ]);
}

// Divider Component
function Divider({ orientation = "horizontal", spacing = "md" }) {
  const spacingValues = { sm: "8px", md: "16px", lg: "24px" };
  const sp = spacingValues[spacing] || spacingValues.md;
  if (orientation === "vertical") {
    return React.createElement("div", { style: { width: "1px", height: "100%", backgroundColor: "#e5e7eb", marginLeft: sp, marginRight: sp } });
  }
  return React.createElement("hr", { style: { border: "none", height: "1px", backgroundColor: "#e5e7eb", width: "100%", marginTop: sp, marginBottom: sp } });
}

// Text Component
function Text({ variant = "body", weight = "normal", children }) {
  const variantStyles = {
    h1: { fontSize: "36px", color: "#111827", lineHeight: "1.2", letterSpacing: "-0.02em" },
    h2: { fontSize: "28px", color: "#111827", lineHeight: "1.3", letterSpacing: "-0.01em" },
    h3: { fontSize: "22px", color: "#111827", lineHeight: "1.4" },
    body: { fontSize: "16px", color: "#374151", lineHeight: "1.6" },
    caption: { fontSize: "14px", color: "#6b7280", lineHeight: "1.5" },
    label: { fontSize: "12px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" }
  };
  const weightStyles = { normal: "400", medium: "500", bold: "700" };
  const Component = variant.startsWith("h") ? variant : "p";
  const style = { ...(variantStyles[variant] || variantStyles.body), fontWeight: weightStyles[weight] || "400", margin: 0 };

  return React.createElement(Component, { style }, children);
}

// Stat Component
function Stat({ label, value, change, trend = "neutral" }) {
  const trendStyles = {
    up: { color: "#059669", bg: "#d1fae5", icon: "↑" },
    down: { color: "#dc2626", bg: "#fee2e2", icon: "↓" },
    neutral: { color: "#6b7280", bg: "#f3f4f6", icon: "→" }
  };
  const trendStyle = trendStyles[trend] || trendStyles.neutral;

  return React.createElement("div", { style: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  } }, [
    React.createElement("p", { key: "label", style: { fontSize: "14px", color: "#6b7280", marginBottom: "8px", margin: 0, fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" } }, label),
    React.createElement("p", { key: "value", style: { fontSize: "32px", fontWeight: "700", color: "#111827", margin: "12px 0", letterSpacing: "-0.02em" } }, value),
    change && React.createElement("div", { key: "change", style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "12px" } },
      React.createElement("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
        backgroundColor: trendStyle.bg,
        color: trendStyle.color
      } }, [
        trendStyle.icon, " ", change
      ])
    )
  ]);
}

// Layout: Stack Component
function Stack({ direction = "vertical", gap = "md", align = "stretch", wrap = false, children }) {
  const gapValues = { sm: "12px", md: "20px", lg: "32px", xl: "48px" };
  const alignValues = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };

  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: direction === "horizontal" ? "row" : "column",
      gap: gapValues[gap] || gapValues.md,
      alignItems: alignValues[align] || "stretch",
      flexWrap: wrap ? "wrap" : "nowrap"
    }
  }, children);
}

// Layout: Grid Component
function Grid({ columns = 1, gap = "md", children }) {
  const cols = typeof columns === "string" ? parseInt(columns, 10) : columns;
  const gapValues = { sm: "12px", md: "20px", lg: "32px" };

  return React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(" + (cols || 1) + ", minmax(0, 1fr))",
      gap: gapValues[gap] || gapValues.md
    }
  }, children);
}

// Layout: Container Component
function Container({ maxWidth = "lg", padding = "md", children }) {
  const maxWidthValues = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", full: "100%" };
  const paddingValues = { sm: "16px", md: "32px", lg: "48px" };

  return React.createElement("div", {
    style: {
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      maxWidth: maxWidthValues[maxWidth] || maxWidthValues.lg,
      paddingLeft: paddingValues[padding] || paddingValues.md,
      paddingRight: paddingValues[padding] || paddingValues.md,
      paddingTop: "32px",
      paddingBottom: "32px"
    }
  }, children);
}

// Layout: Page Component
function Page({ children }) {
  return React.createElement("div", { style: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  } }, children);
}
`;
}
