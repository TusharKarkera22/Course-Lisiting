import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  username: string;
  accessToken: string;  
  refreshToken: string;
  purchasedCourse: string[]; 
  createdAt?: Date; 
  updatedAt?: Date; 
}


interface AuthPayload {
  username: string;
  password: string;
}


interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: string;
  };
  user:User|null;
  message: string;
  statusCode: number;
  success: boolean;
}

interface ErrorResponse {
  message: string;
}

// User login and registration
export const loginUser = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: ErrorResponse }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8080/users/signin', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: ErrorResponse }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8080/users/signup', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin login and registration
export const adminLogin = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: ErrorResponse }>(
  'auth/adminLogin',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8080/admin/signin', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminRegister = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: ErrorResponse }>(
  'auth/adminRegister',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>('http://localhost:8080/admin/signup', payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('adminToken'); // Remove admin token on logout
      localStorage.removeItem('adminRefreshToken'); // Remove admin refresh token on logout
    },
  },
  extraReducers: (builder) => {
    builder
      // User login and registration
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = {
          username: action.payload.user?.username!,
          purchasedCourse:action.payload.user?.purchasedCourse!,
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
        localStorage.setItem('userToken', action.payload.data.accessToken); // Save user token
        localStorage.setItem('userRefreshToken', action.payload.data.refreshToken); // Save user refresh token
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = {
          username: action.payload.user?.username!,
          purchasedCourse:action.payload.user?.purchasedCourse!,
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
        localStorage.setItem('userToken', action.payload.data.accessToken); // Save user token
        localStorage.setItem('userRefreshToken', action.payload.data.refreshToken); // Save user refresh token
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      // Admin login and registration
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = {
          username: action.payload.user?.username!,
          purchasedCourse:action.payload.user?.purchasedCourse!,
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
        localStorage.setItem('adminToken', action.payload.data.accessToken); // Save admin token
        localStorage.setItem('adminRefreshToken', action.payload.data.refreshToken); // Save admin refresh token
      })
      .addCase(adminLogin.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Admin login failed';
      })
      .addCase(adminRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = {
          username: action.payload.user?.username!,
          purchasedCourse:action.payload.user?.purchasedCourse!,
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
        };
        localStorage.setItem('adminToken', action.payload.data.accessToken); // Save admin token
        localStorage.setItem('adminRefreshToken', action.payload.data.refreshToken); // Save admin refresh token
      })
      .addCase(adminRegister.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Admin registration failed';
      });
  },
});

export const { logout } = authSlice.actions;


export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default authSlice.reducer;
