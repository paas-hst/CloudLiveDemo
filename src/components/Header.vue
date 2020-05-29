<template>
    <Header id="head-top">
      <Row>
        <Col span='8'>
          <span class="rec-logo"></span>
        </Col>
        <Col span='8' align='center'>
          <span class="title">
            <span>{{ title }}</span>
          </span>
        </Col>
        <Col span='6'>
          <span class='app-id'>开发者ID：{{ dvlpId }}</span>
        </Col>
        <Col span='2' align='right'>
          <span style="text-align: right">
            <Button shape="circle" type="primary" class="right-btn" @click="onBtnClick">
              {{ btnText }}
            </Button>
          </span>
        </Col>
      </Row>
    </Header>
</template>

<script>
/* eslint-disable */
export default {
    props: {
      title: {
        type: String,
        default: '录制管理'
      }, 
      btnText: {
        type: String,
        default: '退出'
      },
      dvlpId: {
        type: String,
        default: '0530645e9f8a748bd2995a59ea181653'
      },
      goto: {
        type: String,
        default: '/login'
      }
    },
    methods: {
        onBtnClick() {
            sessionStorage.clear();
            this.$router.push({
                path: this.goto
            });
        }
    }
};
</script>

<style scoped>
#head-top .rec-logo {
  position: relative;
  top: 22px;
}

.right-btn {
  width: 80px; 
  height: 30px;
  margin-right: 10px
}

#head-top {
  background: #2d3451;
  margin-bottom: 20px;
}

.logo {
  position: relative;
  top: 22px;
  left: 0px;
}

.title {
  font-size: 18px;
  color: white
}

.app-id {
  font-size: 14px;
  color: #AAB1CE
}

.rec-logout {
  position: relative;
  top: 10px;
  right: -20px;
  float: right;
  font-size: 20px;
  color: #aab1ce;
  cursor: pointer;
}

.rec-logout:hover {
  color: #2f9bf7;
}

.rec-nav {
  width: 300px;
  margin: 0 auto;
}

.ivu-layout-header {
  height: 80px;
  line-height: 80px;
  padding-left: 20px;
  padding-right: 20px
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
  color: #aab1ce;
  font-size: 16px;
  height: 80px;
  line-height: 80px;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
  color: #2f9bf7;
  border-bottom: 2px solid #2f9bf7;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active {
  font-weight: bold;
}
</style>
