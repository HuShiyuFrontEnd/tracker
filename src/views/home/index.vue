<template>
  <md-app>
    <md-app-drawer class="navigator" md-permanent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="label">分类</span>
        <md-button class="md-icon-button" @click.native="addCategory">
          <md-icon>add</md-icon>
        </md-button>
      </md-toolbar>

      <md-list>
        <aside-title
          v-for="(title, index) in titleList"
          :key="`title${index}`"
          :activate="activateOne === index"
          :title-data="title"
          :index="index"
          @view="handleViewCate(index)"
          @changeCate="handleCateChange(title)"
        />
      </md-list>
      <add-cate-dialog
        ref="addCate"
        @categoryAdded="getData"
      />
    </md-app-drawer>

    <md-app-content class="content-container">
      <piece-block-list
        :category-id="categoryId"
        :category-title="categoryTitle"
        :category-name="categoryName"
        :list="pieceList"
        @pieceAdded="getPiece"
      />
    </md-app-content>
  </md-app>
</template>

<script>
import PieceBlockList from './components/piece-block-list'
import AsideTitle from './components/aside-title'
import AddCateDialog from './components/add-cate-dialog'
import { getCategoryList, getPieceList } from './api'

export default {
  name: 'Home',
  components: {
    AsideTitle,
    AddCateDialog,
    PieceBlockList
  },
  inject: ['piecesRefreshEvent'],
  data() {
    return {
      titleList: [],
      pieceList: [],
      activateOne: 0
    }
  },
  computed: {
    categoryId() {
      if (this.titleList.length === 0 || !this.titleList[this.activateOne]) return ''
      return this.titleList[this.activateOne].id
    },
    categoryTitle() {
      if (this.titleList.length === 0 || !this.titleList[this.activateOne]) return ''
      return this.titleList[this.activateOne].title
    },
    categoryName() {
      if (this.titleList.length === 0 || !this.titleList[this.activateOne]) return ''
      return this.titleList[this.activateOne].name
    }
  },
  mounted() {
    this.getData()
    this.piecesRefreshEvent.push(this.getPiece)
  },
  beforeDestroy() {
    this.piecesRefreshEvent.splice(this.piecesRefreshEvent.indexOf(this.getPiece, 1))
  },
  methods: {
    async getData() {
      this.titleList.splice(0, this.titleList.length)
      const data = await getCategoryList()
      this.titleList.splice(0, 0, ...data.data.data)

      if (this.titleList.length > 0) {
        this.getPiece()
      }
    },
    async getPiece() {
      const pieces = await getPieceList(this.categoryId)
      this.pieceList.splice(0, this.pieceList.length, ...pieces.data.data)
      // console.log('get piece', this.pieceList)
    },
    addCategory() {
      this.$refs.addCate.activate('创建一个合集', {
        name: '',
        title: '',
        desc: ''
      })
    },
    handleViewCate(i) {
      this.activateOne = i
      this.getPiece()
    },
    handleCateChange(title) {
      this.$refs.addCate.activate('修改合集', title)
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-transparent{
    .label{
      font-size: 16px;
    }
  }
  .content-container{
    padding-right: 30px;
    * {
      box-sizing: border-box;
    }
    border-left: none;
  }
</style>
