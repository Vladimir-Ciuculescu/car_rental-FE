// src/app/public-layout.tsx
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <html>
    <body>{children}</body>
  </html>
);

export default PublicLayout;
