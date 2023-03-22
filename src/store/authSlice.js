import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios   from "axios";
import jwtDecode from "jwt-decode";

const initialState = {
  token: localStorage.getItem("userToken"),
  name: "",
  email: "",
  id: "",
  registerStatus: "",
  isAdmin:false,
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (value, { rejectWithValue }) => {
    try {
      const token = await axios.post("url/register", {
        name: value.name,
        email: value.email,
        password: value.password,
      });
      localStorage.setItem("userToken", token);
      return token.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (value, { rejectWithValue }) => {
    try {
      const token = await axios.post("url/login", {
        email: value.email,
        password: value.password,
      });

      localStorage.setItem("userToken", token);
      return token.data;
    } catch (err) {
      rejectWithValue(err.response.data);
    }
  }
);

export const getUser = createAsyncThunk("user/getUser", async () => {
  try {
    const token = await axios.get("url/login/${id}", setHeaders());
    localStorage.setItem("userToken", token);
    return token.data;
  } catch (err) {
    rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action) => {
      const token = state.token;
      if (token) {
        const user = jwtDecode(token);
        return {
          ...state,
          token,
          name: user.name,
          email: user.email,
          id: user._id,
          userLoaded: true,
        };
      } else return { ...state, userLoaded: true };
    },

    logoutUser: (state, action) => {
      localStorage.removeItem("userToken");
      return {
        ...state,
        token: "",
        name: "",
        email: "",
        id: "",
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        return { ...state, registerStatus: "pending" };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            id: user._id,
            isAdmin: user.isAdmin,
            registerStatus: "success",
          };
        } else {
          return state;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        return {
          ...state,
          registerStatus: "rejected",
          registerError: action.payload,
        };
      })
      .addCase(loginUser.pending, (state, action) => {
        return {
          ...state,
          loginStatus: "pending",
        };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin,
            loginStatus: "success",
          };
        } else return state;
      })
      .addCase(loginUser.rejected, (state, action) => {
        return {
          ...state,
          loginStatus: "rejected",
          loginError: action.payload,
        };
      })
      .addCase(getUser.pending, (state, action) => {
        return {
          ...state,
          getUserStatus: "pending",
        };
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            name: user.name,
            email: user.email,
            _id: user._id,
            isAdmin: user.isAdmin,
            getUserStatus: "success",
          };
        } else return state;
      })
      .addCase(getUser.rejected, (state, action) => {
        return {
          ...state,
          getUserStatus: "rejected",
          getUserError: action.payload,
        };
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
