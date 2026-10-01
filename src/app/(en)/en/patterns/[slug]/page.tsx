import { createPatternPage, createPatternMetadata, patternStaticParams } from '@/app/shared/pattern-page';

const LOCALE = 'en' as const;

export const generateStaticParams = patternStaticParams;
export const generateMetadata = createPatternMetadata(LOCALE);
export default createPatternPage(LOCALE);