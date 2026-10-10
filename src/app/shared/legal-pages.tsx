import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { href } from '@/lib/i18n';
import { site } from '@/lib/site';
import { t } from '@/lib/ui-strings';

/**
 * 法律与合规静态页工厂（中英双语）。
 * 遵循与 pattern-page.tsx / pages.tsx 相同的架构：工厂封装，双语统一渲染。
 */

export function createPrivacyPage(locale: Locale) {
  return function PrivacyPage() {
    return (
      <article className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-[680px]">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href={href('/', locale)}
              className="inline-flex min-h-[44px] items-center text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              ← {t(locale, 'nav.home')}
            </Link>
          </nav>

          <header className="border-b border-line pb-6">
            <p className="meta mb-2">Legal · Compliance</p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
            </h1>
            <p className="mt-2 text-xs text-muted">
              {locale === 'zh' ? '生效日期：2026 年 10 月' : 'Effective date: October 2026'}
            </p>
          </header>

          <div className="prose-note mt-8 space-y-8 text-[0.9375rem] leading-relaxed text-ink2">
            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '1. 核心承诺：零数据收集' : '1. Core Principle: Zero Data Collection'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? `${site.name} 是一个纯静态知识词典。我们不设立用户账号系统、不运行后端服务器、不建立数据库，亦不主动收集您的任何个人身份信息（PII）。`
                  : `${site.name} is a fully static visual dictionary. We do not have user accounts, do not operate backends or databases, and do not collect any Personally Identifiable Information (PII).`}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '2. 本地存储 (LocalStorage)' : '2. Local Storage'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '为了记录您的学习进度（如「已学会」标记），站点会在您浏览器的 LocalStorage 中保存状态（键名：uifg.learned.v1）。这些数据 100% 留存在您的本地设备上，绝不会上传至任何云端或服务器。清除浏览器缓存即可彻底销毁全部数据。'
                  : 'To keep track of your learning progress (such as "learned" marks), this site stores state in your browser LocalStorage (key: uifg.learned.v1). This data stays 100% on your device and is never uploaded. Clearing your browser data deletes everything.'}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '3. 分享卡片与图片处理' : '3. Share Cards & Image Generation'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '站点内生成的 3:4 与 1:1 分享卡片完全基于您本地浏览器的 HTML5 Canvas 与 DOM 离屏抓取渲染，图片导出或剪贴板复制全部在本地内存完成，绝无图片上传行为。'
                  : 'All share cards generated on this site are rendered strictly inside your local browser via HTML5 Canvas and offscreen DOM capture. Images are exported or copied directly in local memory and are never sent to any server.'}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '4. 第三方服务与托管' : '4. Third-Party Services & Hosting'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '本站静态资源托管于全球 CDN（如 Cloudflare Pages）。CDN 可能会因安全防御与 DDoS 缓解需求在边缘节点记录基础网络日志（如 IP 地址与访问路径），但这完全遵从托管商隐私保护准则，本站不对其进行任何商业化追踪。'
                  : 'Static assets are hosted on global edge CDNs (such as Cloudflare Pages). Edge servers may log standard connection metadata (IP addresses, request paths) solely for DDoS defense and security compliance under the host privacy policies.'}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '5. 联络与反馈' : '5. Contact & Feedback'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '如对本政策有任何疑问，您可通过 GitHub 仓库提交 Issue 与维护团队联系。'
                  : 'If you have any questions regarding this policy, please open an Issue on our official GitHub repository.'}
              </p>
            </section>
          </div>
        </div>
      </article>
    );
  };
}

export function createTermsPage(locale: Locale) {
  return function TermsPage() {
    return (
      <article className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-[680px]">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href={href('/', locale)}
              className="inline-flex min-h-[44px] items-center text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            >
              ← {t(locale, 'nav.home')}
            </Link>
          </nav>

          <header className="border-b border-line pb-6">
            <p className="meta mb-2">Legal · Terms</p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {locale === 'zh' ? '服务条款' : 'Terms of Service'}
            </h1>
            <p className="mt-2 text-xs text-muted">
              {locale === 'zh' ? '生效日期：2026 年 10 月' : 'Effective date: October 2026'}
            </p>
          </header>

          <div className="prose-note mt-8 space-y-8 text-[0.9375rem] leading-relaxed text-ink2">
            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '1. 产品性质与使用授权' : '1. Purpose & License'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? `${site.name} 是为 AI 独立开发者打造的可视化 UI/UX 词典与 Prompt 参考手册。本项目的代码基于 MIT 许可证开源，您可以自由查阅、参考、复用其中的设计模式与提示词结构。`
                  : `${site.name} is a visual UI/UX dictionary and prompt guide built for AI builders and developers. The project code is open source under the MIT License.`}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '2. 免责声明 (AI 提示词)' : '2. AI Prompt Disclaimer'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '词条中包含的三层 Ask AI Prompt 与 Bad/Better Prompt 均为实践经验总结。由于第三方大语言模型（如 Claude、GPT 等）具有概率性与不可控性，我们不保证任何特定提示词在任意模型下均能生成 100% 理想的代码结果。'
                  : 'The multi-level AI prompts and examples provided are curated recommendations. Because third-party LLMs are probabilistic, we cannot guarantee specific code generation outcomes across different models.'}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '3. 知识产权与商标' : '3. Intellectual Property'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '词典中提及的 UI 术语（如 Bottom Sheet、Toast 等）为业界公认的通用交互模式，相关操作系统的商标归属于各自拥有者（Apple、Google、Microsoft 等）。'
                  : 'UI pattern names referenced are recognized industry standards. Respective platform trademarks remain the property of their respective owners.'}
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-ink">
                {locale === 'zh' ? '4. 条款更新' : '4. Updates to Terms'}
              </h2>
              <p className="mt-2">
                {locale === 'zh'
                  ? '我们保留根据产品演进更新本条款的权利，更新后的条款自本页面发布时即时生效。'
                  : 'We reserve the right to modify these terms as the project evolves. Changes become effective upon posting.'}
              </p>
            </section>
          </div>
        </div>
      </article>
    );
  };
}
