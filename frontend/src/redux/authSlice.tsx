import { createSlice ,PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
const initialState:AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action:PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth:() =>{
        return initialState;
    }
  },
});

export const { setAuthUser,clearAuth } = authSlice.actions;
export default authSlice.reducer;