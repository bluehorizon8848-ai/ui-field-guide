import { createPrivacyPage } from '@/app/shared/legal-pages';
import { createStaticMetadata } from '@/app/shared/pages';

const LOCALE = 'zh' as const;

export const metadata = createStaticMetadata('/privacy', LOCALE);
export default createPrivacyPage(LOCALE);
