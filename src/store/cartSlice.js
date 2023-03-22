import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  cart: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtocart: (state, action) => {
      const existingIndex = state.cart.findIndex((item) => {
        return item.id === action.payload.id;
      });

      if (existingIndex >= 0) {
        state.cart[existingIndex] = {
          ...state.cart[existingIndex],
          cartQuantity: state.cart[existingIndex].cartQuantity + 1,
        };
      } else {
        let productItem = { ...action.payload, cartQuantity: 1 };
        state.cart.push(productItem);
        // toast.success("Product added to cart", {
        //     position: "bottom-left",
        //   });
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decreasecart: (state, action) => {
      const itemIndex = state.cart.findIndex((item) => {
        return item.id === action.payload.id;
      });

      if (state.cart[itemIndex].cartQuantity > 1) {
        state.cart[itemIndex].cartQuantity -= 1;
      } else if (state.cart[itemIndex].cartQuantity === 1) {
        const nextcartItem = state.cart.filter((item) => {
          return item.id !== action.payload.id;
        });

        state.cart = nextcartItem;
      }

      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      const cartItem = state.cart.filter((item) => {
        return item.id !== action.payload.id;
      });
      state.cart = cartItem;
    },
    getTotal: (state, action) => {
      let { total, quantity } = state.cart.reduce(
        (acc, curr) => {
          const { price, cartQuantity } = curr;
          const itemTotal = price * cartQuantity;
          acc.total += itemTotal;
          acc.quantity += cartQuantity;
          return acc;
        },
        {
          total: 0,
          quantity: 0,
        }
      );

      total = parseFloat(total.toFixed(2));

      state.cartTotalAmount = total;
      state.cartTotalQuantity = quantity;
    },
    clearCart: (state, action) => {
      state.cart = [] ;
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;

      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
  },
});

export const { getTotal, clearCart, addtocart, decreasecart, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
