"use client";

import Link from "next/link";
import { buildWhatsAppUrl, whatsappConfig } from "../../lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppButton() {
  const href = buildWhatsAppUrl(whatsappConfig.phoneNumber, whatsappConfig.defaultMessage);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(37,211,102,0.45)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
    </Link>
  );
}
