import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact | CryptoBriefs",
  description: "Get in touch with CryptoBriefs. Questions, feedback, partnerships, or issue reports — reach us at admin@cryptobriefs.net.",
  alternates: {
    canonical: "https://cryptobriefs.net/contact",
  },
  openGraph: {
    title: "Contact | CryptoBriefs",
    description: "Get in touch with CryptoBriefs. Questions, feedback, or partnerships — we'd love to hear from you.",
    url: "https://cryptobriefs.net/contact",
    siteName: "CryptoBriefs",
    images: [{ url: "https://cryptobriefs.net/og-image.svg", width: 1200, height: 630, alt: "CryptoBriefs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | CryptoBriefs",
    description: "Get in touch with CryptoBriefs. Questions, feedback, or partnerships.",
    images: ["https://cryptobriefs.net/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
