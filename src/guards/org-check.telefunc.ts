import { getContext } from "telefunc";
import { err, ok } from "neverthrow";

export async function orgCheck() {
    const { user, session } = getContext()
    if (!user || !session) {
        return err({text: "User or session not found", code: "NO_AUTH"})
    }
    if (!session.activeOrganizationId){
        return err({text:"No organization selected", code: "NO_ORG"});
    }
    return ok({})
}