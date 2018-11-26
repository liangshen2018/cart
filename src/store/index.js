import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    beeCart: JSON.parse(localStorage.getItem('beeCart')) || []
    // beeCart: [
    //   {
    //     id: '2435', // 商品id
    //     count: 1, // 已选择商品的数量
    //     isSelected: true // 商品是否选中
    //   },
    //   {
    //     id: '6834',
    //     count: 1,
    //     isSelected: true
    //   },
    //   {
    //     id: '9045',
    //     count: 1,
    //     isSelected: true
    //   }
    // ]
  },
  getters: {
    ids: state => {
      return state.beeCart.map(item => {
        return item.id
      })
    },
    total: state => {
      return state.beeCart.reduce((total, item) => {
        return (total += item.count)
      }, 0)
    },
    newData: state => {
      return state.beeCart.reduce((data, item) => {
        data[item.id] = {
          count: item.count,
          isSelected: item.isSelected
        }
        return data
      }, {})
    },
    isSelectedAll: state => {
      return state.beeCart.every(item => item.isSelected)
    }
  },
  mutations: {
    addCart(state, goods) {
      let currentGoods = state.beeCart.find(item => item.id === goods.id)
      if (!currentGoods) {
        state.beeCart.push({
          ...goods,
          isSelected: true
        })
      } else {
        currentGoods.count = goods.count
      }
      localStorage.setItem('beeCart', JSON.stringify(state.beeCart))
    },
    update(state, payload) {
      state.beeCart = payload.value
      localStorage.setItem('beeCart', JSON.stringify(state.beeCart))
    }
  }
})
