<template>
  <div id="base">
    <div class="query-line">
      <span class="query-label">App ID:</span>
      <span class="val">
        <Input size="small" style="width: 300px;" v-model.trim="queryAppId" />
      </span>
      <span class="query-label" style="margin-left: 30px">Group ID:</span>
      <span class="val">
        <Input size="small" style="width: 160px;" v-model.trim="queryGroupId" disabled />
      </span>
      <span class="query-label" style="margin-left: 30px;">Live State:</span>
      <span class="val">
        <Select v-model="queryLiveState" size="small" style="width:100px;" disabled>
          <Option
            v-for="item in queryLiveStateList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </span>
      <span style="float:right; margin-right:10px">
        <Button
          shape="circle"
          type="primary"
          style="width: 80px; height: 30px"
          @click="queryLiveList(true)"
        >查询</Button>
        <Button
          shape="circle"
          type="primary"
          style="width: 80px; height: 30px; margin-left: 10px; background-color: #1BC38E; border: 0px"
          @click="showCreateModal = true"
        >创建</Button>
      </span>
    </div>

    <Row class="table">
      <Table
        border
        :highlight-row="true"
        :columns="tabHeader"
        :data="tabData"
        :loading="tabLoading"
      />
    </Row>

    <Row class="tab-info">
      <Col span="12">
        <!--<span>显示第 1 到 10 条记录，总共 25 条记录 每页显示</span>-->
        <span>{{ tableText }}</span>
        <Select
          v-model="pageSize"
          size="small"
          style="width:60px; margin:0 10px"
          @on-change="pageSizeChange"
        >
          <Option v-for="i in pageSizeList" :value="i" :key="i">{{ i }}</Option>
        </Select>
        <span>条记录</span>
      </Col>
      <Col span="12" class="tar">
        <Page :total="totalCount" size="small" :page-size="pageSize" @on-change="pageChange" />
      </Col>
    </Row>

    <!-- 创建直播任务对话框 -->
    <Modal v-model="showCreateModal" title="创建直播任务" @on-ok="createLive" :width="450">
      <div class="create-modal">
        <Row>
          <Col span="24">
            <span style="margin-left: 38px">App ID：</span>
            <Input style="width: 300px; height: 30px" v-model.trim="liveAppId" />
          </Col>
        </Row>
        <Row style="margin-top: 15px">
          <Col span="24">
            <span style="margin-left: 38px">分组ID：</span>
            <Input style="width: 300px; height: 30px" v-model.trim="liveGroupId" />
          </Col>
        </Row>   
        <Row style="margin-top: 0px">
          <Col span="24">
              <div class="row-div" style="margin-top: 15px; margin-right: 10px;">
                <span style="margin-left: 25px;">视频宽度：</span>
                <Input style="width: 300px;" v-model.trim.number="videoWidth" />
              </div>
              <div class="row-div" style="margin-top: 15px; margin-right: 10px;">
                <span style="margin-left: 25px;">视频高度：</span>
                <Input style="width: 300px;" v-model.trim.number="videoHeight" />
              </div>
              <div class="row-div" style="margin-top: 15px; margin-right: 10px;">
                <span style="margin-left: 25px;">视频帧率：</span>
                <Input style="width: 300px;" v-model.trim.number="frameRate" />
              </div>
              <div class="row-div" style="margin-top: 15px; margin-right: 10px;">
                <span style="margin-left: 25px;">裁剪模式：</span>
                <Select v-model.number="cropMode" style="width: 300px">
                  <Option
                    v-for="item in cropModeList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
              <div class="row-div" style="margin-top: 15px; margin-right: 10px;">
                <span style="margin-left: 25px;">视频质量：</span>
                <Select v-model.number="qualityMode" style="width: 300px">
                  <Option
                    v-for="item in qualityModeList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </div>
          </Col>
        </Row>
      </div>
    </Modal>
  </div>
</template>

<script>
/* eslint-disable */
import { simpleDateFormat } from "../lib/dateUtil";
/* eslint-disable */
export default {
  data() {
    return {
      //////////////////////////////////////////////////////////////////////////
      // 创建录制任务对话框相关变量

      // 直播App ID
      liveAppId: null,
      // 录制分片大小（分钟）
      recordSliceDuration: 60,
      // 最大录制视频路数
      maxVideoCount: 9,
      // 视频裁剪模式
      cropMode: 1,
      cropModeList: [
        {
          value: 1,
          label: "平铺拉伸"
        },
        {
          value: 2,
          label: "等比裁剪"
        },
        {
          value: 3,
          label: "等比完整"
        }
      ],
      // 视频裁剪模式
      qualityMode: 1,
      qualityModeList: [
        {
          value: 1,
          label: "流畅"
        },
        {
          value: 2,
          label: "平衡"
        },
        {
          value: 3,
          label: "清晰"
        }
      ],
      
      // 录制视频宽高（分辨率）
      videoWidth: 1920,
      videoHeight: 1080,
      frameRate: 15,
      // 创建录制任务输入的Group ID
      liveGroupId: null,
      // 控制显示创建录制任务对话框
      showCreateModal: false,

      //////////////////////////////////////////////////////////////////////////
      // 查询相关变量

      // App ID
      queryAppId: null,
      // 录制任务状态
      queryLiveState: -1,
      queryLiveStateList: [
        { value: 0, label: "未开始" },
        { value: 1, label: "直播中" },
        { value: 2, label: "已结束" }
      ],
      // 查询Group ID
      queryGroupId: null,
      // 支持分页查询的查询参数缓存
      storeParams: {},
      //////////////////////////////////////////////////////////////////////////
      // 表格相关变量

      // 显示页码
      page: 1,
      // 每页显示数据数
      pageSize: 10,
      pageSizeList: [10, 20, 30],
      // 表格数据的排列是否升序
      order: false,
      // 表格是否处于loading状态
      tabLoading: false,
      // 表格数据
      tabData: [],
      // 表头定义
      tabHeader: [
        {
          title: "Group ID",
          key: "groupId",
          align: "center",
          width: "170"
        },
        {
          title: "Live State",
          align: "center",
          width: "100",
          render: (h, params) => {
            let str = "未开始";
            if (params.row.liveState === 0) {
              str = "未开始";
            } else if (params.row.liveState === 1) {
              str = "直播中";
            } else if (params.row.liveState === 2) {
              str = "已完成";
            }
            return h("p", str);
          }
        },
        {
          title: "Start Time",
          key: "startTime",
          align: "center",
          width: "170",
          sortable: true
        },
        {
          title: "FLV URL",
          key: "flvUrl",
          align: "center",
          width: "180",
          sortable: false
        },
        {
          title: "RTMP URL",
          key: "rtmpUrl",
          align: "center",
          width: "180",
          sortable: false
        },
        {
          title: "HLS URL",
          key: "hlsUrl",
          align: "center",
          width: "180",
          sortable: false
        },
        {
          title: "Operation",
          align: "center",
          width: "118",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  attrs: {
                    href: "javascript:void(0);",
                    style: "margin-right: 10px; color: #1BC38E;"
                  },
                  on: {
                    click: () => {
                      this.playLive(params);
                    }
                  }
                },
                "观看"
              ),
              h(
                "a",
                {
                  attrs: {
                    href: "javascript:void(0);",
                    style: "margin-right: 10px; color: #ec6049"
                  },
                  on: {
                    click: () => {
                      this.stopLive(params.row.groupId);
                    }
                  }
                },
                "停止"
              )
            ]);
          }
        }
      ],
      // 总共多少条记录
      totalCount: 0,
      // 表格分页信息
      tableText: "总共0条记录，每页显示"
    };
  },

  mounted() {
    // 设置Head上相关显示属性
    this.updateBaseAttr();

    this.queryAppId = localStorage.getItem("queryAppId");

    this.queryLiveList(false);
  },

  methods: {
    playLive(param) {
      console.log(param);
      // 播放页面需要显示AppID
      param.row.appId = this.queryAppId;
      this.$router.push({ name: "player", params: param.row});
    },
    /**
     * 父组件初始化完成后通知子组件
     */
    onBaseReady() {
      this.queryLiveList(false);
    },
    /**
     * 设置Header显示信息及按钮点击跳转地址
     */
    updateBaseAttr() {
      this.$emit("updateAttr", {
        title: "直播管理",
        btnText: "退出",
        goto: "/login"
      });
    },
    /**
     * 构建创建录制任务参数
     */
    buildcreateLiveParams() {
      let params = {
        app_id: this.liveAppId,
        group_id: this.liveGroupId,
        crop_mode: this.cropMode,
        frame_rate: this.frameRate,
        width: this.videoWidth,
        height: this.videoHeight,
        qulity_level: this.qualityMode,
      };

      console.log(params);
      return params;
    },
    /**
     * 创建录制任务
     */
    createLive() {
      if (this.liveGroupId == null || this.liveGroupId.length === 0) {
        this.$Message.warning("Group ID不能为空");
        return;
      } else if (this.liveAppId == null || this.liveAppId.length === 0) {
        this.$Message.warning("App ID不能为空");
        return;
      }

      fetch(localStorage.getItem("businessGwUrl") + "/v1/live/start", {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("accessToken"),
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(this.buildcreateLiveParams())
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          this.$Message.error("创建直播失败！");
          console.error(response);
        })
        .then(data => {
          if (data.code === 0) {
            this.$Message.success("创建直播成功！");
            this.queryLiveList(false);
            console.log(data);
          } else {
            this.$Message.error("创建直播失败！");
            console.log(data);
          }
        })
        .catch(err => {
          this.$Message.error("创建直播失败！");
          console.log(err);
        });

    },
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
    /**
     * 查询直播列表响应处理
     * @param liveList 服务器返回的直播列表
     */
    handleQueryLiveListRsp(liveList) {
      this.tabData = [];
      this.totalCount = liveList.length;

      for (const live of liveList) {
        this.tabData.push({
          groupId: live.group_id,
          liveState: 1, // TODO: 没有返回，这里写死
          startTime: this.timestampToTime(live.start_time),
          flvUrl: live.flv_url,
          hlsUrl: live.m3u8_url,
          rtmpUrl: live.rtmp_url
        });
      }

      // 显示table分页信息
      if (this.totalCount === 0) {
        this.tableText = "总共0条记录，每页显示";
      } else {
        let textNum =
          (this.page - 1) * this.pageSize + 1;
        let textNum1 =
          (this.page - 1) * this.pageSize +
          this.tabData.length;
        this.tableText =
          "显示第" +
          textNum +
          "到第" +
          textNum1 +
          "条记录，总共" +
          this.totalCount +
          "条记录，每页显示";
      }
    },
    /**
     * 构建查询URL
     */
    buildQueryLiveListUrl() {
      let url = localStorage.getItem("businessGwUrl") + "/v1/live/list";
      
      // App ID
      url += ("?" + "app_id=" + this.queryAppId);

      // // Group ID
      // if (this.queryGroupId !== null && this.queryGroupId.length !== 0) {
      //   url += ("&group_id=" + this.queryGroupId);
      // }

      // // Record state
      // if (this.queryLiveState !== -1) {
      //   url += ("&status=" + this.queryLiveState);
      // }

      // // Page & page size
      // url += ("&page=" + this.page + "&page_size=" + this.pageSize);

      console.log(url);

      return url;
    },
    /**
     * 查询录制任务
     * showMessage 是否进行提示
     */
    queryLiveList(showMessage) {
      if (this.queryAppId == null || this.queryAppId.length === 0) {
        showMessage && this.$Message.warning("App ID不能为空");
        return;
      }
      
      // 查询之前先清掉列表
      this.tabData = [];

      // 保存查询条件
      localStorage.setItem("queryAppId", this.queryAppId);

      fetch(this.buildQueryLiveListUrl(), {
        headers: {
          Authorization: localStorage.getItem("accessToken")
        }
      })
      .then(resp => {
        return resp.json();
      })
      .then(resp => {
        if (resp.code === 0) {
          console.log(resp);
          if (resp.result.live_info_list.length > 0) {
            this.handleQueryLiveListRsp(resp.result.live_info_list);
          } else {
            showMessage && this.$Message.warning("直播列表为空");
          }
        } else {
          showMessage && this.$Message.error("获取直播列表失败！");
          console.log(resp);
        }
      })
      .catch(err => {
        showMessage && this.$Message.error("获取直播列表失败！");
        console.log(err);
      });
    },

    /**
     * 删除本地保存的录制任务
     * @param recordId 录制任务ID
     */
    stopLive(groupId) {
      let param = { 
        app_id: this.queryAppId,
        group_id: groupId
      };
      console.warn(param);
      fetch(localStorage.getItem("businessGwUrl") + "/v1/live/stop", {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("accessToken"),
          "content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(param)
      })
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        if (data.code == 0) {
          this.$Message.success("停止直播成功！");
          this.queryLiveList(false);
        } else {
          this.$Message.error("停止直播失败！");
          console.log(data);
        }
      })
      .catch(err => {
        this.$Message.error("停止直播失败！");
        console.log(err);
      });
    },
    /**
     * 换页处理
     * @param page 页码
     */
    pageChange(page) {
      this.page = page;
      this.queryLiveList();
    },
    /**
     * 修改每页显示最大记录数处理
     * @param pageSize 每页最大显示记录数
     */
    pageSizeChange(pageSize) {
      this.queryLiveList(false);
    }
  }
};
</script>

<style>
.ivu-modal .ivu-modal-content {
  background-color: #272f51;
}

.ivu-modal .ivu-modal-header {
  background-color: #2e375e;
  border: 0px;
}

.ivu-modal .ivu-modal-footer {
  background-color: #2e375e;
  border: 0px;
}

.ivu-modal .ivu-btn-text {
  background-color: #39446f;
  color: white;
}

.ivu-modal .ivu-modal-footer button {
  width: 90px;
  height: 30px;
  border-radius: 15px;
  padding: 0px;
}

.ivu-modal .ivu-modal-header-inner {
  color: white;
}

.ivu-modal .ivu-input {
  height: 30px;
  background-color: #39446f;
  border: 1px #4a578b;
  color: #8e99c7;
}

.ivu-modal .ivu-select-selection {
  height: 30px;
  background-color: #39446f;
  border: 1px #4a578b;
  color: #8e99c7;
}
</style>

<style scoped>
.query-label {
  margin-right: 10px;
  margin-top: 6px;
  font-family: "MicrosoftYaHei";
}

.query-line {
  width: 1100px;
  height: 30px;
  /* display: flex; */
  vertical-align: middle;
  font-size: 14px;
  color: white;
}

.row-div {
  margin-top: 15px;
}

.order {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #ffffff;
}

.search {
  margin-top: 0px;
}

.table {
  margin-top: 20px;
  width: 1100px;
  overflow: auto;
  line-height: 24px;
}

.tab-info {
  width: 1100px;
  margin-top: 10px;
  font-size: 14px;
  color: #ffffff;
}

.create-modal {
  font-size: 12px;
  color: white;
}
</style>
