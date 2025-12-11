import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

type InitialState = {
  mode: string;
  themeColorsIndex: number;
};

const initialState: InitialState = {
  mode: "light",           // default
  themeColorsIndex: 0,     // default
};

// Load Async from SecureStore
export const loadTheme = createAsyncThunk("theme/loadTheme", async () => {
  const mode = (await SecureStore.getItemAsync("theme")) || "light";

  const indexString = await SecureStore.getItemAsync("themeColorsIndex");
  const themeColorsIndex = indexString ? Number(indexString) : 0;

  return { mode, themeColorsIndex };
});

loadTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      SecureStore.setItemAsync("theme", state.mode);
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.mode = action.payload;
      SecureStore.setItemAsync("theme", action.payload);
    },
    setThemeColorsIndex: (state, action: PayloadAction<number>) => {
      state.themeColorsIndex = action.payload;
      SecureStore.setItemAsync("themeColorsIndex", action.payload.toString());
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload.mode;
      state.themeColorsIndex = action.payload.themeColorsIndex;
    });
  },
});

export const { toggleTheme, setTheme, setThemeColorsIndex } =
  themeSlice.actions;

export default themeSlice.reducer;
