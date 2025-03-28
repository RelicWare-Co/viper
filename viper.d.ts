
import 'telefunc'
import type {auth} from "@/server/auth"
declare module 'telefunc' {
  namespace Telefunc {
    interface Context {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    }
  }
}

// biome-ignore lint/complexity/noUselessEmptyExport: required for typescript
export {}