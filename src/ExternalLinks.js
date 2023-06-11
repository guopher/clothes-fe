import { BUG_FORM, FEEDBACK_FORM } from "./strings"

  export const giveFeedback = () => {
    window.open(FEEDBACK_FORM, '_blank')
  }

  export const submitBug = () => {
    window.open(BUG_FORM, '_blank')
  }