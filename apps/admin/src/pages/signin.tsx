import { Authentication } from "@squoolr/auth";
import { injectIntl, IntlShape } from "react-intl";

function Signin({intl}:{intl:IntlShape}) {
  return (
    <Authentication callingApp="admin" intl={intl} />
  )
}

export default injectIntl(Signin)