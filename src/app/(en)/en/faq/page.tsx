import { createFaqPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/faq', LOCALE);
export default createFaqPage(LOCALE);
