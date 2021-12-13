import _ from 'lodash';

const getDefaultState = () => {
  return {
    cartItems: [],
  };
};

export const state = () => getDefaultState();

export const mutations = {
  add(state, item) {
    state.cartItems.push(item);
  },

  update(state, item) {
    const index = state.cartItems.reduce((i, cart, index) => cart.id === item.id ? index : i, -1);
    if (~index) {
      state.cartItems[index].dis = item.dis * 1;
      state.cartItems[index].qty = item.qty;
    }
  },

  remove(state, item) {
    state.cartItems.splice(state.cartItems.indexOf(item), 1);
  },

  reset(state) {
    state.cartItems = [];
  },
};

export const actions = {
  addCartItems({ commit }, item) {
    commit("add", item);
  },

  updateCartItem({ commit }, item) {
    commit("update", item);
  },

  removeCartItem({ commit }, item) {
    commit("remove", item);
  },

  resetCartItems({ commit }) {
    commit("reset");
  },
};

export const getters = {
  cartItems : (state) => {
    return state.cartItems;
  },
}