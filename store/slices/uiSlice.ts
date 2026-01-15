import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isAdminRoute: boolean;
}

const initialState: UiState = {
  isAdminRoute: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAdminRoute: (state, action: { payload: boolean }) => {
      state.isAdminRoute = action.payload;
    },
  },
});

export const { setAdminRoute } = uiSlice.actions;
export default uiSlice.reducer;
