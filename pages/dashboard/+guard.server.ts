import { redirect } from 'vike/abort'
import type { PageContext } from 'vike/types'
  
export function guard(pageContext: PageContext) {
  if (!pageContext.session) {
    throw redirect("/auth");
  }
  if (!pageContext.session.activeOrganizationId) {
    throw redirect("/orgs");
  }
}