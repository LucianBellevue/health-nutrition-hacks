import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NewsletterStatus = "idle" | "loading" | "success" | "error";

interface NewsletterState {
  email: string;
  status: NewsletterStatus;
  errorMessage: string;
}

const initialState: NewsletterState = {
  email: "",
  status: "idle",
  errorMessage: "",
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
      if (state.status === "error") {
        state.status = "idle";
        state.errorMessage = "";
      }
    },
    submitStart(state) {
      state.status = "loading";
      state.errorMessage = "";
    },
    submitSuccess(state) {
      state.status = "success";
      state.email = "";
      state.errorMessage = "";
    },
    submitError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.errorMessage = action.payload;
    },
    resetStatus(state) {
      state.status = "idle";
      state.errorMessage = "";
    },
  },
});

export const { setEmail, submitStart, submitSuccess, submitError, resetStatus } = newsletterSlice.actions;
export default newsletterSlice.reducer;
