import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";




const store=configureStore({
    reducer:{
product:productReducer,
cart:cartReducer,
user:authReducer
    }
})

export default store