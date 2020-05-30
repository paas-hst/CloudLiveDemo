<template>
  <div id="liver-player">
    <Row>
      <div class="live-info-line">
        <span class="record-info-label">App ID：</span>
        <span class="record-info-value">{{ appId }}</span>
        <span class="record-info-label">Group ID：</span>
        <span class="record-info-value">{{ groupId }}</span>        
        <span class="record-info-value"></span>
      </div>
    </Row>
    <Row class="media-layout">
      <Col span="24">
        <div class="layout-column-title">
          <RadioGroup v-model="liveUrl" type="button" size="small">
            <Radio :label="this.$route.params.flvUrl">
              <span>FLV</span>
            </Radio>
            <Radio :label="this.$route.params.rtmpUrl">
              <span>RTMP</span>
            </Radio>
            <Radio :label="this.$route.params.hlsUrl">
              <span>HLS</span>
            </Radio>
          </RadioGroup>
        </div>
        <div style="height: 100%; width: 100%;">
          <div v-if="showPlayer" >
            <ali-player
              @play="onPlay"
              :isLive=true 
              :autoplay=true 
              :source="playUrl" 
              height='480px' 
              width='100%' 
            />
          </div>
        </div>
      </Col>
    </Row>
    <div class="show-info-panel">
      <div class="info-list">
        <div v-for="(item, index) in infoList" :key="index" class="info-item">
          <span class="time">{{item.time}}</span>
          <span :class="[item.status === 0 ? 'status-success' : 'status-error']">{{item.msg}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Screen from "../components/Screen";
import VueAliplayer from 'vue-aliplayer';
import { simpleDateFormat } from "../lib/dateUtil";

export default {
  data() {
    return {
      appId: this.$route.params.appId,
      // 选择URL
      liveUrl: "",
      // 播放URL
      playUrl: "",
      // 录制分组ID
      groupId: this.$route.params.groupId,
      // 提示信息
      infoList: [],
      // 控制页面内重建播放器
      showPlayer: true
    };
  },

  watch: {
    liveUrl(val) {
      this.addShowMsg("切换直播源：" + val, true);
      this.playUrl = val;
      this.showPlayer = false;
      this.$nextTick(() => {
        this.showPlayer = true;
      });
    }
  },

  components: {
    'ali-player': VueAliplayer, 
    Screen 
  },

  beforeDestroy() {
    this.liveUrl = "";
  },

  mounted() {
    this.updateBaseAttr();

    // 默认选择RTMP源
    this.liveUrl = this.$route.params.rtmpUrl;
  },

  methods: {
    /**
     * 添加显示信息
     */
    addShowMsg(message, flag) {
      let dateStr = simpleDateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      this.infoList.push({
        time: dateStr,
        status: flag ? 0 : 1,
        msg: message
      });
    },
    /**
     * 开始播放回调
     */
    onPlay() {
      this.addShowMsg("开始播放", true);
    },
    /**
     * 设置Header上的显示信息和按钮的跳转控制
     */
    updateBaseAttr() {
      this.$emit("updateAttr", {
        title: "观看直播",
        btnText: "返回",
        goto: "/live/manager"
      });
    },
  }
};
</script>

<style scoped>
.show-info-panel {
  height: 170px;
  background-color: #2d3451;
  margin-top: 20px;
  border-radius: 4px;
}

.layout-column-title {
  height: 40px;
  background-color: #363f61;
  margin-top: 0px;
  line-height: 40px;
  text-align: center;
  color: #8e99c7;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
}

.media-column-title {
  height: 40px;
  background-color: #363f61;
  margin-top: 20px;
  line-height: 40px;
  margin-left: 10px;
  text-align: center;
  color: #8e99c7;
  font-size: 14px;
  border-radius: 4px 4px 0 0;
}

.live-info-line {
  height: 50px;
  background-color: #2d3451;
  margin-top: 0px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 50px;
}

.record-info-label {
  margin-left: 20px;
  color: #8e99c7;
}

.record-info-value {
  display: inline-block;
  color: white;
}

.liver-player {
  width: 1100px;
}

.auto-record-layout {
  height: 422px;
  background-image: url("../image/auto_layout_bg.png");
  background-size: 100% 100%;
}

.auto-record-layout-body {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: white;
  padding-top: 210px;
}

.voice {
  margin-top: 5px;
  color: #ffffff;
}

.media-layout {
  margin-top: 20px;
  height: 520px;
}

.media-layout .head {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 10px;
}

.show-info-panel .info-list {
  width: 1100px;
  height: 170px;
  padding: 10px 10px;
  overflow: auto;
  background: #2d3451;
  border-radius: 4px;
}

.show-info-panel .info-item {
  font-size: 14px;
  margin-bottom: 0px;
}

.show-info-panel .info-item:last-child {
  margin-bottom: 0;
}

.show-info-panel .time {
  color: #8e99c7;
  margin-right: 20px;
}

.show-info-panel .status-success {
  color: greenyellow;
}

.show-info-panel .status-error {
  color: #ff6d46;
}

.show-info-panel .info {
  color: #ffffff;
}

.row-div-1 {
  margin-bottom: 10px;
}

/* .ivu-radio-group-button .ivu-radio-wrapper {
  height: 20px;
  line-height: 18px;
} */
</style>
