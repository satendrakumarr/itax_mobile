import { createSlice } from '@reduxjs/toolkit';
import setupClient from '../setup/setupClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  csrf: null,
  url: null,
  user_data: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { csrf, url } = action.payload;
      state.csrf = csrf;
      setupClient(csrf, '192.168.12.72:8088');
      AsyncStorage.setItem('csrf', csrf);
      state.url = url;
    },
    logout: (state) => {
      state.csrf = null;
      state.url = null;
    },
    setUserData: (state, action) => {
      state.user_data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, setUserData } = authSlice.actions;

export default authSlice.reducer;
