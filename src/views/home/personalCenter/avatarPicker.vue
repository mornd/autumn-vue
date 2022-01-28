<template>
  <div class="cropper-content">
    <div class="cropper-box">
      <div style="text-align: center">
        <vue-cropper
          ref="cropper"
          class="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="option.info"
          :canScale="option.canScale"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :full="option.full"
          :fixedBox="option.fixedBox"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :centerBox="option.centerBox"
          :height="option.height"
          :infoTrue="option.infoTrue"
          :maxImgSize="option.maxImgSize"
          :enlarge="option.enlarge"
          :mode="option.mode"
          @realTime="realTime"
          @imgLoad="imgLoad"
        >
        </vue-cropper>
        <i class="el-icon-zoom-in" @click="changeScale(1)"></i>
        <i class="el-icon-zoom-out" @click="changeScale(-1)"></i>
        <i class="el-icon-refresh-left" @click="rotateLeft"></i>
        <i class="el-icon-refresh-right" @click="rotateRight"></i>
      </div>

      <!--图片预览展示区域-->
      <div class="cropper-warp">
        <span>预览</span>
        <div class="avatar-frame">
          <el-image
            :style="previews.img"
            style="width: 150px; height: 150px"
            :src="previews.url"
            fit="cover"
          >
          </el-image>
        </div>
        <span>150×150</span>
      </div>
    </div>

    <!--图片操作按钮-->
    <div class="cropper-btns">
      <label class="select-img-btn" for="uploads">选择</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
      <el-button size="small" type="primary" :loading="submitLoading" @click="uploadImg('blob')">上传</el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "avatarPicker",
    data() {
      return {
        previews: {},
        submitLoading: false,
        option:{
          img: '',             //裁剪图片的地址
          outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
          outputType: 'jpeg',  //裁剪生成图片的格式（jpeg || png || webp）
          info: true,          //图片大小信息
          canScale: true,      //图片是否允许滚轮缩放
          autoCrop: true,      //是否默认生成截图框
          autoCropWidth: 150,  //默认生成截图框宽度
          autoCropHeight: 150, //默认生成截图框高度
          fixed: true,         //是否开启截图框宽高固定比例
          fixedNumber: [1, 1], //截图框的宽高比例
          full: false,         //false按原比例裁切图片，不失帧
          fixedBox: true,      //固定截图框大小，不允许改变
          canMove: true,       //上传图片是否可以移动
          canMoveBox: false,   //截图框能否拖动
          original: false,     //上传图片按照原始比例渲染
          centerBox: false,    //截图框是否被限制在图片里面
          height: true,        //是否按照设备的dpr 输出等比例图片
          infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
          maxImgSize: 3000,    //限制图片最大宽度和高度
          enlarge: 1,          //图片根据截图框输出比例倍数
          mode: '300px 300px'  //图片默认渲染方式
        }
      }
    },
    mounted() {
      //如果用户已有头像则先展示用户头像
      if(this.avatarUrl) {
        this.option.img = this.avatarUrl
      }
    },
    methods: {
      //初始化函数
      imgLoad (msg) {
        //console.log("工具初始化函数====="+msg)
      },
      //图片缩放
      changeScale (num) {
        num = num || 1
        this.$refs.cropper.changeScale(num)
      },
      //向左旋转
      rotateLeft () {
        this.$refs.cropper.rotateLeft()
      },
      //向右旋转
      rotateRight () {
        this.$refs.cropper.rotateRight()
      },
      //实时预览函数 每移动一次截图框，那么图片展示那里就要更新图片
      realTime (data) {
        this.previews = data
      },
      //选择图片
      selectImg (e) {
        let file = e.target.files[0]
        if(!file) return false
        if (!/\.(jpg|jpeg|png|JPG|PNG|gif|GIF)$/.test(e.target.value)) {
          this.$message({
            message: '上传的图片类型需为jpeg、jpg、png、gif',
            type: "error"
          });
          return false
        }
        const isLt5M = file.size / 1024 / 1024 < 5
        if(!isLt5M) {
          this.$message({
            message: '上传的图片大小需小于5M',
            type: "error"
          });
          return false
        }
        //转化为blob
        let reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            // 把Array Buffer转化为blob 如果是base64则不需要
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          this.option.img = data
        }
        //转化为base64
        reader.readAsDataURL(file)
      },
      //上传图片
      uploadImg (type) {
        this.submitLoading = true
        let _this = this;
        if (type === 'blob') {
          //获取截图的blob数据
          this.$refs.cropper.getCropBlob(async (data) => {
            let formData = new FormData();
            const userId = _this.user.id
            formData.append('file', data, '_' + userId + '.jpg')
            formData.append('id', userId)
            //调用axios上传
            let res = await _this.$api.postRequest('/upload/avatar', formData)
            if(res.success){
              const url = res.data
              _this.$emit('uploadSuccess', 'http://' + url)
            }
            this.submitLoading = false
          })
        }
      }
    },
    computed: {
      ...mapState(['user']),
    },
    props: {
      avatarUrl: String
    }
  }
</script>

<style lang="less" scoped>
  .cropper-box {
    display: flex;
    justify-content: space-around;
    /* 截图区域 */
    .cropper {
      width: 300px;
      height: 300px;
    }
    i {
      font-size: 25px;
      font-weight: bold;
      margin: 20px 10px 0 10px;
      cursor: pointer;
    }

    .cropper-warp {
      text-align: center;
      /*展示的头像框*/
      .avatar-frame {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 20px 0 20px 0;
        overflow: hidden;
        box-shadow: 0 0 6px rgb(0 21 41 / 35%);
      }
    }
  }

  /*操作按钮组*/
  .cropper-btns {
    margin-top: 10px;
    display: flex;
    justify-content: right;
    width: 100%;
    //选取图片按钮
    .select-img-btn {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      -webkit-appearance: none;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      outline: 0;
      -webkit-transition: .1s;
      transition: .1s;
      font-weight: 500;
      padding: 10px 15px;
      font-size: 12px;
      border-radius: 3px;
      color: #fff;
      background-color: #409EFF;
      border-color: #409EFF;
      margin-right: 10px;
    }
  }
</style>