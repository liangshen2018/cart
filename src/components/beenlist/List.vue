<template>
  <div class="been-list">
    <BeeHeader></BeeHeader>
    <div class="been-list-content">
      <!-- 左侧菜单 -->
      <div class="left-menu">
        <ul>
          <li v-for="(menu, i) in categories" :key="menu.id" @click="selectMenu(i, menu.id)">
            <!-- new: menu.icon -->
            <span class="num-price" :class="{ new: !menu.icon, active: selectIndex === i}">{{ menu.name }}</span>
          </li>
        </ul>
      </div>

      <!-- 右侧内容 -->
      <div class="con">
        <div class="right-con con-active">
          <!-- 顶部标题 -->
          <div class="product-filter">
            <ul class="filter-titles">
              <li class="filter-title">全部分类&nbsp;</li>
              <li class="filter-title">综合排序&nbsp;</li>
            </ul>
          </div>

          <!-- 列表 -->
          <ul>
            <li v-for="item in selectedProductions" :key="item.id">
              <div class="menu-img" @click="goInfo(item.id)">
                <img :src="item.img" width="55" height="55">
              </div>
                <div class="menu-txt" @click="goInfo(item.id)">
                  <h4>{{ item.name }}</h4>
                  <p class="activity" style="display: none;"></p>
                  <p class="list1">{{ item.specifics }}</p>
                  <p class="list2">
                    <b>￥{{ item.price }}</b>
                    <s v-if="item.price !== item.market_price">￥{{ item.market_price }}</s>
                  </p>
                </div>
                <ProductOperate v-model="item.count" @addGoods="addGoods(item.id)"></ProductOperate>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <BeeFooter></BeeFooter>
  </div>
</template>

<script>
import BeeHeader from '../common/Header'
import BeeFooter from '../common/Footer'
import ProductOperate from '../product-operate/ProdOperate'

export default {
  data() {
    return {
      categories: [],
      selectedProductions: [],
      products: [],
      selectIndex: 0
    }
  },
  methods: {
    async getCategories() {
      let res = await this.$axios.jsonp('http://localhost:3008/list')
      console.log(res)
      let { data: { categories, products }, errno } = res
      if (errno === 0) {
        let newData = this.$store.getters.newData        
        this.categories = categories
        this.products = products
        this.selectedProductions = products[categories[0].id].map(item => {
          return {
            ...item,
            count: (newData[item.id] && newData[item.id].count) || 0
          }
        })
      }
    },
    selectMenu(i, id) {
      let newData = this.$store.getters.newData
      this.selectIndex = i
      this.selectedProductions = this.products[id].map(item => {
        return {
          ...item,
          count: (newData[item.id] && newData[item.id].count) || 0
        }
      })
    },
    addGoods(id) {
      let count = this.selectedProductions.find(item => item.id === id).count
      this.$store.commit('addCart', {
        count,
        id
      })
    },
    goInfo(id) {
      this.$router.push(`/goodsinfo/${id}`)
    }
  },
  created() {
    this.getCategories()
  },
  components: {
    ProductOperate,
    BeeHeader,
    BeeFooter
  }
}
</script>

<style lang="stylus" scoped>
.been-list {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
}

.been-list-content {
  display: flex;
  position: absolute;
  width: 100%;
  top: 4.5rem;
  bottom: 4.5rem;
  background: #ffffff;

  .con {
    flex: 1;
    position: relative;
    overflow-y: scroll;
  }

  .left-menu {
    flex: 0 0 80px;
    width: 80px;
    background: #F8F8F8;
    overflow-y: scroll;

    li {
      display: table;
      height: 54px;
      width: 80px;
      line-height: 54px;
      border-bottom: 1px solid #e0e0e0;
      text-align: center;

      .num-price {
        display: block;
        background: right top no-repeat;
        background-size: auto 70%;
      }

      .new {
        background-image: url('../../assets/images/new.jpg');
      }
    }

    .active {
      border-left: 4px solid #ffd600;

      .num-price {
        width: 80px;
        margin-left: -4px;
      }
    }
  }
}

.filter-titles {
  position: fixed;
  z-index: 999;
  top: 4.5rem;
  left: 80px;
  right: 0;
  padding-top: 8px;
  background-color: #fff;
  font-size: 1rem;
  color: #777;

  .filter-title {
    position: relative;
    float: left;
    width: 50%;
    text-align: center;
  }
}
</style>

<style>
.left-menu::-webkit-scrollbar {
  width: 0px;
}
.main {
  overflow: hidden;
}
.con .con-active {
  display: block;
}

.right-con > ul {
  margin-top: 43px;
}
.right-con li {
  position: relative;
  border-bottom: 1px solid #e7eaeb;
  border-top: 1px solid #fff;
  padding-bottom: 8px;
  margin-bottom: 2px;
}

.right-con li .menu-img {
  position: absolute;
  width: 55px;
  height: 55px;
  margin-left: 10px;
  top: 15px;
  border-radius: 3px;
  cursor: pointer;
  background-image: url(../../assets/images/product_default.png);
  background-size: cover;
}

.right-con li .menu-img img {
  height: 55px;
  width: 55px;
  vertical-align: middle;
  border: 0;
}

.right-con li .menu-txt {
  margin: 15px 15px 15px 75px;
}

.right-con li .menu-txt h4 {
  font-size: 16px;
  margin-bottom: 10px;
  margin-top: 8px;
  white-space: nowrap;

  text-overflow: ellipsis;
  overflow: hidden;
}
.right-con li .menu-txt p {
  font-style: normal;
  line-height: 20px;
  vertical-align: bottom;
}
.right-con li .menu-txt p.activity {
  border: 1px solid red;
  display: inline-block;
  color: red;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.2rem 0.2rem 0.1rem;
  margin-right: 0.3rem;
  border-radius: 0.4rem;
  vertical-align: 0.1rem;
}
.right-con li .menu-txt p.list1 {
  color: #999;
}
.right-con li .menu-txt p.list2 b {
  color: #f00;
}
.right-con li .menu-txt p.list2 s {
  color: #999999;
}
</style>
