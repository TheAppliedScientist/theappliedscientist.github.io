import type { Metadata, Viewport } from "next";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/figures.css";
import { site } from "./site.config";
import Masthead from "./components/Masthead";
import Colophon from "./components/Colophon";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — automated scientific revision`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "article",
    images: [{ url: "/img/og-card.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/img/og-card.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F0E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#system" className="skip-link">
          Skip to content
        </a>
        <Masthead />
        {children}
        <Colophon />
      </body>
    </html>
  );
}
