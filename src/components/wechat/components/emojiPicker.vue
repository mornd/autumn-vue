<template>
  <div>
      <span>最近使用</span>
      <ul id="recent-use">
        <li :title="item.title" v-for="(item, index) in recentUse" @click="choose(item)" :key="index">
          {{ item.emoji }}
        </li>
      </ul>
      <span>全部表情</span>
      <ul :style="{height}">
        <li :title="item.title" v-for="(item, index) in emojis" @click="choose(item)" :key="index">
          {{ item.emoji }}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: "emojiPicker",
  data() {
    return {
      // 最近使用的表情
      recentUse: [],
      // 最近使用表情最多缓存个数
      saveUseCount: 8,
      // 全部表情
      emojis: [{emoji: '😀', title: '嘿嘿'},{emoji: '😁', title: '嘻嘻'},{emoji: '😂', title: '笑哭了'},{emoji: '🤣', title: '笑的满地打滚'},{emoji: '😃', title: '哈哈'},{emoji: '😄', title: '大笑'},{emoji: '😅', title: '苦笑'},{emoji: '😆', title: '斜眼笑'}
        ,{emoji: '😉', title: '眨眼'},{emoji: '😊', title: '羞涩微笑'},{emoji: '😋', title: '好吃'},{emoji: '😎', title: '墨镜微笑'},{emoji: '😍', title: '花痴'},{emoji: '😘', title: '飞吻'},{emoji: '🥰', title: '飞吻plus'},{emoji: '😗', title: '亲亲'}
        ,{emoji: '😙', title: '微笑亲亲'},{emoji: '😚', title: '羞涩亲亲'},{emoji: '🤭', title: '不说'},{emoji: '🙂', title: '呵呵'},{emoji: '🤗', title: '抱抱'},{emoji: '🤩', title: '好崇拜哦'},{emoji: '🤔', title: '想一想'},{emoji: '🤨', title: '扬眉吐气'}
        ,{emoji: '😐', title: '冷漠'},{emoji: '😑', title: '无语'},{emoji: '😶', title: '沉默'},{emoji: '🙄', title: '翻白眼'},{emoji: '😏', title: '得意'},{emoji: '😣', title: '痛苦'},{emoji: '😥', title: '失望但如释重负'},{emoji: '😮', title: '吃惊'}
        ,{emoji: '🤐', title: '闭嘴'},{emoji: '😯', title: '缄默'},{emoji: '😪', title: '困'},{emoji: '😫', title: '累'},{emoji: '🥱', title: '打哈欠'},{emoji: '😴', title: '睡着了'},{emoji: '😌', title: '松了口气'},{emoji: '😛', title: '吐舌'}
        ,{emoji: '😜', title: '单眼吐舌'},{emoji: '😝', title: '眯眼吐舌'},{emoji: '🤤', title: '流口水'},{emoji: '😒', title: '不高兴'},{emoji: '😓', title: '汗'},{emoji: '😔', title: '沉思'},{emoji: '😕', title: '困扰'},{emoji: '🙃', title: '倒脸'}
        ,{emoji: '🤑', title: '发财'},{emoji: '😲', title: '震惊'},{emoji: '🙁', title: '不满'},{emoji: '😖', title: '困惑'},{emoji: '😟', title: '失望'},{emoji: '😟', title: '担心'},{emoji: '😤', title: '傲慢'},{emoji: '😰', title: '冷汗'}
        ,{emoji: '😢', title: '哭'},{emoji: '😭', title: '放声大哭'},{emoji: '😦', title: '啊'},{emoji: '😧', title: '极度痛苦'},{emoji: '😨', title: '害怕'},{emoji: '😩', title: '累死了'},{emoji: '🤯', title: '爆炸头'},{emoji: '😬', title: '呲牙咧嘴'}
        ,{emoji: '😱', title: '吓死了'},{emoji: '🥵', title: '惊恐'},{emoji: '🥶', title: '冷'},{emoji: '😳', title: '脸红'},{emoji: '🤪', title: '疯狂的脸'},{emoji: '😵', title: '晕头转向'},{emoji: '😠', title: '生气'},{emoji: '😡', title: '怒火中烧'}
        ,{emoji: '🤬', title: '嘴上有符号的脸'},{emoji: '😷', title: '感冒'},{emoji: '🤒', title: '发烧'},{emoji: '🤕', title: '受伤'},{emoji: '🤢', title: '恶心'},{emoji: '🤮', title: '呕吐'},{emoji: '🤧', title: '打喷嚏'},{emoji: '🧐', title: '带单片眼镜的脸'}
        ,{emoji: '🤓', title: '龅牙眼镜'},{emoji: '🤡', title: '阳光男孩'},{emoji: '🤠', title: '牛仔帽脸'},{emoji: '👨', title: '男人'},{emoji: '💢', title: '怒'},{emoji: '👻', title: '鬼'},{emoji: '🐽', title: '猪鼻子'},{emoji: '👀', title: '双眼'}
        ,{emoji: '👹', title: '食人魔'},{emoji: '👺', title: '天狗'},{emoji: '💀', title: '头骨'},{emoji: '👿', title: '恶魔'},{emoji: '👾', title: '怪物'},{emoji: '🤖', title: '机器人'},{emoji: '💩', title: '扎克'},{emoji: '🐔', title: '只因'}],
    }
  },
  mounted() {
    // 缓存中读取
    const value = sessionStorage.getItem('chat-recent-emoji')
    if(value !== null) {
      this.recentUse = JSON.parse(value)
    }
  },
  methods: {
    // 选择表情
    choose(e) {
      this.$emit('choose', e.emoji)

      if(this.recentUse.length < this.saveUseCount) {
        for(let i = 0; i < this.recentUse.length; i++) {
          if(this.recentUse[i].emoji === e.emoji) {
            if(i === 0) return
            // 如果已经存在，先删除存在的，再插入至第一位
            this.recentUse.splice(i, 1)
            this.recentUse.unshift(e)
            // 结束该方法
            return
          }
        }
        // 不存在则直接插入至第一位
        this.recentUse.unshift(e)
      } else {
        // 超过了保存的个数
        for(let i = 0; i < this.recentUse.length; i++) {
          if(this.recentUse[i].emoji === e.emoji) {
            if(i === 0) return
            // 已经存在了，则从存在的元素前，所有元素往后移一位，再将存在的插入到第一位
            for(let j = i; j > 0; j--) {
              this.recentUse[j] = this.recentUse[j - 1]
            }
            this.recentUse.splice(0, 1, e)
            return
          }
        }
        // 不存在，所有元素后移一位，再插入至第一位
        for(let i = this.recentUse.length - 1; i > 0; i--) {
          this.recentUse[i] = this.recentUse[i - 1]
        }
        this.recentUse.splice(0, 1, e)
      }

      // 加入缓存
      sessionStorage.removeItem('chat-recent-emoji')
      sessionStorage.setItem('chat-recent-emoji', JSON.stringify(this.recentUse))
    }
  },
  props: {
    height: {
      type: String,
      require: false,
      default: () => {return '200px'}
    }
  }
}
</script>

<style lang="less" scoped>
  span {
    font-size: 12px;
  }
  #recent-use {
    height: 38px;
    overflow: hidden;
  }
  ul {
    margin-top: 5px;
    overflow-x: hidden;
    overflow-y: overlay;
    //overflow-y: -moz-scroll;
    li {
      font-size: 20px;
      cursor: pointer;
      margin: 5px;
      display: inline-block;
      border-radius: 3px;
      &:hover {
        transform: scale(1.3,1.3);
        background: #F2F2F2;
      }
    }
  }
</style>
