import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NewsletterStatus = "idle" | "loading" | "success" | "error";
export type NewsletterFormId = "inline" | "popup" | "footer";

interface FormState {
  email: string;
  status: NewsletterStatus;
  errorMessage: string;
}

interface NewsletterState {
  forms: Record<NewsletterFormId, FormState>;
  popupDismissed: boolean;
  hasSubscribed: boolean;
}

const initialFormState: FormState = {
  email: "",
  status: "idle",
  errorMessage: "",
};

const initialState: NewsletterState = {
  forms: {
    inline: { ...initialFormState },
    popup: { ...initialFormState },
    footer: { ...initialFormState },
  },
  popupDismissed: false,
  hasSubscribed: false,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<{ formId: NewsletterFormId; email: string }>) {
      const { formId, email } = action.payload;
      state.forms[formId].email = email;
      if (state.forms[formId].status === "error") {
        state.forms[formId].status = "idle";
        state.forms[formId].errorMessage = "";
      }
    },
    submitStart(state, action: PayloadAction<NewsletterFormId>) {
      state.forms[action.payload].status = "loading";
      state.forms[action.payload].errorMessage = "";
    },
    submitSuccess(state, action: PayloadAction<NewsletterFormId>) {
      state.forms[action.payload].status = "success";
      state.forms[action.payload].email = "";
      state.forms[action.payload].errorMessage = "";
      state.hasSubscribed = true;
    },
    submitError(state, action: PayloadAction<{ formId: NewsletterFormId; error: string }>) {
      const { formId, error } = action.payload;
      state.forms[formId].status = "error";
      state.forms[formId].errorMessage = error;
    },
    resetStatus(state, action: PayloadAction<NewsletterFormId>) {
      state.forms[action.payload].status = "idle";
      state.forms[action.payload].errorMessage = "";
    },
    dismissPopup(state) {
      state.popupDismissed = true;
    },
    resetPopupDismissed(state) {
      state.popupDismissed = false;
    },
  },
});

export const { 
  setEmail, 
  submitStart, 
  submitSuccess, 
  submitError, 
  resetStatus,
  dismissPopup,
  resetPopupDismissed,
} = newsletterSlice.actions;
export default newsletterSlice.reducer;
