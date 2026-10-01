import { createIdentifyPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'en' as const;

export const metadata = createStaticMetadata('/identify', LOCALE);
export default createIdentifyPage(LOCALE);
