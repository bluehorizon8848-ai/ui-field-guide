import { createIdentifyPage, createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/identify', LOCALE);
export default createIdentifyPage(LOCALE);
