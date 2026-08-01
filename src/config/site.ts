export const PHONE_WHATSAPP: string = '529984934110';
export const PHONE_DISPLAY: string = '+52 998 493 4110';
export const PHONE_SCHEMA: string = '+529984934110';

export const DEFAULT_WHATSAPP_MESSAGE: string =
  'Hola, me gustaría solicitar información y cotización sobre sus servicios de albañilería.';

export function getWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);
  return `https://wa.me/${PHONE_WHATSAPP}?text=${text}`;
}
