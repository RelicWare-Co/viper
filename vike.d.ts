import type { getDB } from "@/lib/get-db";
import type { auth } from "@/server/auth";

declare global {
    namespace Vike {
      interface PageContext {

        // Refine type of pageContext.Page (it's `unknown` by default)
        Page: () => React.JSX.Element
        db: ReturnType<typeof getDB>
        session: typeof auth.$Infer.Session.session | null
        user?: typeof auth.$Infer.Session.user | null
      }
    }
  }
   
  // If you define Vike.PageContext in a .d.ts file then
  // make sure there is at least one export/import statement.
  // Tell TypeScript this file isn't an ambient module:
  // biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
  export {}