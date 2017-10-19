<template>
  <div class="chefPage">
    <el-row type="flex" justify="center">
      <el-col :span="20" class="head">
        <template>
          <el-carousel :interval="4000" :type="isCard" height="430px" class="carousel" :initial-index="1" :class="">
            <el-carousel-item v-for="(item,index) in chefImg" :key="index" >
              <div class="carouselItem" v-lazy:background-image="item.url" @mouseenter="showWrapper(index)"
                   @mouseleave="hideWrapper(index)"  @click="toUser(item.id)">
                <transition name="fade">
                  <el-tooltip effect="dark" content="点击查看大厨主页" placement="top" v-if="isWrapper[index]">
                    <div class="imgContent">
                      <strong class="name">{{item.name}}</strong>: <span v-for="skillItem in item.skill" class="skill">{{ skillItem}}</span><br>
                      <span class="content">{{item.content}}</span>
                    </div>
                  </el-tooltip>
                </transition>
                <div style="width: 100%; height: 100%; z-index: -10; transition: all 0.3s;"
                     :style="isWrapper[index]"></div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </template>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="chefMessage" style="margin-top: 30px;">
      <el-col :span="20">
        <el-checkbox-group @change="checkChange" v-model="checkbox" size="large" fill="#324057" text-color="#a4aebd"
                           :min="1" :max="choice.length">
          <el-checkbox-button v-for="(item,index) in choice" :label="item" :key="item" style="border-radius: 8px;">{{item}}</el-checkbox-button>
        </el-checkbox-group>
        <el-card class="chefContent">
          <div>
              <div v-for="(item,index) in this.newTeacher" class="animated fadeIn" style="display: inline-block;" :key="item.name">
                <div class="chef" @click="toUser(item.id)">
                  <headImg :size="'B'" :url="item.url" :id="item.id"></headImg>
                  <div class="content">
                    <span class="name">{{item.name}}</span>
                    <br>
                    <span class="skill" v-for="skillItem in item.skill">{{skillItem}}</span>
                  </div>
                </div>
              </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import headImg from '.././user/headimg.vue'

  import Vue from 'vue'
  import ElCarousel from 'element-ui/lib/carousel'
  import ElCarouselItem from 'element-ui/lib/carousel-item'
  import EltTooltip from 'element-ui/lib/tooltip'
  import ElCheckboxGroup from 'element-ui/lib/checkbox-group'
  import ElCheckboxButton from 'element-ui/lib/checkbox-button'

  Vue.use(ElCarousel)
  Vue.use(ElCarouselItem)
  Vue.use(EltTooltip)
  Vue.use(ElCheckboxGroup)
  Vue.use(ElCheckboxButton)
  export default {
    data() {
      return {
        message: {"chefImg": [], "chef": [{"url": "", "id": "", "name": "", "skill": [], "status": ""}]},
        chefImg: [{"url": "", "id": "", "name": "", "skill": [], "content": ""}],
        isCard: 'card',
        documentW: 0,
        carouselItemWrapper: "background: rgba(0,0,0,0.4);", //图片上的遮盖层样式
        isWrapper: [],                                        //是否显示图片上的遮盖层
        choice: ["全部", "金牌", "签约", "认证", "中餐", "西餐", "糕点"],
        checkbox: ["金牌"],
        newTeacher: [{"url": "", "id": "", "name": "", "skill": [], "status": ""}],
        allTeacher: [{"url": "", "id": "", "name": "", "skill": [], "status": ""}],
        filterArr: [{"index": 0, "key": []}]
      }
    },
    created() {
      document.body.style.backgroundImage = "url('./static/chef/bg-chef0.jpg')";
      document.body.style.backgroundRepeat = "repeat";//background-size auto
      document.body.style.backgroundSize = 'auto';//
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.overflow = 'auto';
      if(document.documentElement.clientWidth < 1000) {
        this.isCard = '';
      }else {
        this.isCard = 'card';
      }
      this.axios.get('/api/chef').then((res) => {
        //console.log(res.data);
        //this.message = res.data;
        this.allTeacher.length = 0;
        this.allTeacher = res.data;
        this.filterArr.length = 0;
        for (let i = this.allTeacher.length -1; i >= 0 ; i--) {
          //筛选列表
          let skills = this.allTeacher[i].skill;
          let filterObj = {"index": 0, "key": []};
          filterObj.index = i;
          for (let j = skills.length -1; j >=0 ; j--) {
            filterObj.key.push(skills[j]);
          }
          filterObj.key.push(this.allTeacher[i].status);
          this.filterArr.push(filterObj);
        }
        this.filterChef(this.checkbox);
      }).catch();
      this.axios.get('/api/chefImg').then((res) => {
        //console.log(res.data);
        //给轮播图赋值
        let chefImg = res.data;
        this.chefImg.length = 0;
        for (let i = 0; i < chefImg.length; i++) {
          this.chefImg.push(chefImg[i]);
          this.isWrapper.push('');
        }
      }).catch(()=>{});

    },
    methods: {
      showWrapper(index) {
        this.$set(this.isWrapper, index, this.carouselItemWrapper);
      },
      hideWrapper(index) {
        this.$set(this.isWrapper, index, '');
      },
      filterChef(arr) {
        let indexArr = []; //存放筛选后的索引
        this.newTeacher.length = 0;
        if(arr.indexOf("全部") !== -1 ) {
          for(let n = 0;n<this.allTeacher.length;n++) {
            this.newTeacher.push(this.allTeacher[n]);
          }
          return;
        }

        for (let i = 0; i < this.allTeacher.length; i++) {
          for (let h = 0; h < arr.length; h++) {
            //判断等级
            if (arr[h] === this.allTeacher[i].status) {
              indexArr.push(i);
              continue;
            }
            //判断skill
            let skills = this.allTeacher[i].skill;
            for (let j = 0; j < skills.length; j++) {
              if (arr[h] === skills[j]) {
                indexArr.push(i);
                break;
              }
            }
          }
        }
        //去重
        let targetArr = [];
        for (let k = 0; k < indexArr.length; k++) {
          let flag = (targetArr.indexOf(indexArr[k]) === -1);

          //将不重复加入数组
          if (flag) {
            targetArr.push(indexArr[k]);
          }
        }
        //将筛选后的索引的值给正在显示的chef
        for (let m = 0; m < targetArr.length; m++) {
          this.newTeacher.push(this.allTeacher[targetArr[m]]);
        }
      },
      checkChange() {
        //this.checkbox = this.checkbox.filter(t => t !== "全部");
        this.filterChef(this.checkbox);
      }
    },
    mounted() {
      this.documentW = document.documentElement.clientWidth;
      const that = this;
      window.onresize = function temp() {
        that.documentW = document.documentElement.clientWidth;
        if (that.documentW < 1000) {
          that.isCard = '';
        }
        else {
          that.isCard = 'card';
        }
      };
    },
  components: {
    headImg
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .chefPage
    .head
      .el-carousel__indicators
        margin-top 10px
      .carousel
        margin-top 21px
        .carouselItem
          position relative
          width 100%
          height 100%
          background-position center center
          background-repeat no-repeat
          background-size cover
          .imgContent
            background rgba(255, 255, 255, 0.7)
            border-radius 12px
            padding 10px
            position absolute
            left 25%
            right 25%
            top 30%
            .name
              font-size 25px
              padding 0 25px
            .skill
              font-size 16px
              padding-left 10px
              color rgba(0, 0, 0, 0.8)
            .content
              display inline-block
              text-indent 1em
              width 100%
              font-size 20px
              line-height 30px
              margin-top 20px
              text-overflow ellipsis
        .el-carousel__indicators
          z-index 900
          bottom 20px
          .el-carousel__indicator
            margin-left 3px
            margin-right 2px
            .el-carousel__button
              height 5px
              width 55px
              border-radius 3px
          .is-active
            .el-carousel__button
              background #726dd1

    .chefMessage
      .el-card__body
        margin-bottom 10px
       .el-checkbox-button__inner
        background #eee
      .chefContent
        background #eee
        border-radius 8px
        margin-bottom 30px
        .chef
          display inline-block
          overflow hidden
          width 210px
          padding 10px
          margin 10px 35px 10px 35px
          border 2px solid #999
          border-radius 10px
          background #ddd
          cursor pointer
          &:hover
            box-shadow 0 0 20px rgba(0,0,0,0.6)
        .content
          text-align center
          .name
            display inline-block
            font-size 20px
            margin-top 10px
          .skill
            display inline-block
            margin-top 10px
            padding-right 10px
  @media screen and (max-width: 1000px)
    .chefPage
      .head
        .carousel
          .el-carousel__indicators
            .el-carousel__indicator
              .el-carousel__button
                height 3px
                width 25px

  @media screen and (max-width: 550px)
    .chefPage
      .head
        .carousel
          .el-carousel__indicators
            .el-carousel__indicator
              .el-carousel__button
                height 3px
                width 10px
                margin 0
                padding-left 2px
                padding-right 2px
</style>
