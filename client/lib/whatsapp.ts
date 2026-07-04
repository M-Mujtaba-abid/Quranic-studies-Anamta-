const defaultWhatsAppConfig = {
  phoneNumber: "+971500000000",
  defaultMessage: "Hello! I would like to know more about your services.",
};

function resolveWhatsAppConfig() {
  const rawConfig = process.env.NEXT_PUBLIC_WHATSAPP_CONFIG;

  if (rawConfig) {
    try {
      const parsed = JSON.parse(rawConfig) as Partial<typeof defaultWhatsAppConfig>;

      return {
        phoneNumber: parsed.phoneNumber || defaultWhatsAppConfig.phoneNumber,
        defaultMessage: parsed.defaultMessage || defaultWhatsAppConfig.defaultMessage,
      };
    } catch {
      return defaultWhatsAppConfig;
    }
  }

  return {
    phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || defaultWhatsAppConfig.phoneNumber,
    defaultMessage:
      process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE || defaultWhatsAppConfig.defaultMessage,
  };
}

export const whatsappConfig = resolveWhatsAppConfig();

export function buildWhatsAppUrl(
  phoneNumber = whatsappConfig.phoneNumber,
  defaultMessage = whatsappConfig.defaultMessage,
) {
  const normalizedPhone = phoneNumber.trim();
  const digits = normalizedPhone.replace(/\D/g, "");

  if (!digits) {
    return "https://wa.me/";
  }

  const baseUrl = `https://wa.me/${digits}`;

  if (!defaultMessage.trim()) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(defaultMessage.trim())}`;
}
