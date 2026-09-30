'use client';

import { demoRegistry } from './registry';

/**
 * 按 ID 取 Demo 的客户端边界。
 *
 * registry 里的 Demo 全部是 Client Component，Server Component 不能直接
 * import 那个对象（会拿到 client reference 而不是组件本身），所以查表动作
 * 必须发生在一个真正的 Client Component 里。
 */
export function DemoById({ id }: { id: string }) {
  const Demo = demoRegistry[id];
  if (!Demo) return null;
  return <Demo />;
}
