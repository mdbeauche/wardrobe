import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_URI, SERVER_PORT } from '../../config';

export interface UserState {
  isAuthenticated: boolean;
  pending: boolean;
  error: boolean;
  errorMessage: string;
  data: object;
}

const initialState: UserState = {
  isAuthenticated: false,
  pending: false,
  error: false,
  errorMessage: '',
  data: {},
};

interface Response {
  success: boolean;
  message: String;
  data: Array<Object>;
}

const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios({
      method: 'post',
      url: `${SERVER_URI}:${SERVER_PORT}/login`,
      data: {
        email,
        password,
      },
    });

    if (response.status === 200 && response.data) {
      const responseData: Response = response.data as Response;

      if (responseData.success) {
        return responseData.data;
      }
    }

    throw new Error(`Unable to authenticate user: ${response.data}`);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.pending = false;
    },
    clearUser(state) {
      state.isAuthenticated = false;
      state.pending = false;
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<object>) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.pending = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = true;
      state.errorMessage = `${action.error.message}`;
      state.pending = false;
    });
  },
});

export { login };
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
