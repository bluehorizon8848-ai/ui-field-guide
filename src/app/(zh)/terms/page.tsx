import { createTermsPage } from '@/app/shared/legal-pages';
import { createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/terms', LOCALE);
export default createTermsPage(LOCALE);
