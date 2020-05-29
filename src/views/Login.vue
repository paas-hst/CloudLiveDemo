<template>
  <div id="login">
    <div class="rec-logo"></div>
    <div class="login-form">
      <h2>云直播DEMO</h2>
      <div style="margin-bottom: 20px;">
        <Input
          class="login-input"
          v-model.trim="dvlpId"
          prefix="ios-contacts"
          size="large"
          placeholder="请输入开发者ID"
          style="width: 300px;"
          autocomplete="on"
        />
      </div>
      <div style="margin-bottom: 20px;">
        <Input
          class="login-input"
          v-model.trim="dvlpSecret"
          prefix="ios-contact"
          size="large"
          placeholder="请输入开发者秘钥"
          style="width: 300px;"
          autocomplete="on"
        />
      </div>
      <div style="margin-bottom: 20px;">
        <Input
          v-show="privateCloud"
          class="login-input"
          v-model.trim="accessUrl"
          prefix="ios-list"
          size="large"
          placeholder="接入服务地址"
          style="width: 300px;"
          autocomplete="on"
        />
      </div>
      <div>
        <Button type="primary" size="large" @click="login">登录</Button>
      </div>
      <div style="margin-top: 8px">
        <Checkbox
          v-model="privateCloud"
          style="float: right; padding-right: 50px; color: white; margin-bottom: 20px"
        >私有云</Checkbox>
      </div>
    </div>
    <div class="login-footer">
      <p>Copyright &copy; 2013-2019 hst.com. All Rights Reserved.</p>
      <p>深圳银澎云计算有限公司</p>
    </div>
  </div>
</template>

<script>
/**
 * 非Chrome浏览器进行提示
 */
if (navigator.userAgent.indexOf("Chrome") < 0) {
  this.$Message.warning({
    content: "建议使用Chrome浏览器访问！",
    duration: 15
  });
}
/**
 * 判断参数有效性
 */
function isEmpty(param) {
  if (
    param == null ||
    param === "undefined" ||
    param === "null" ||
    param.length === 0
  ) {
    return true;
  } else {
    return false;
  }
}
/* eslint-disable */
export default {
  name: "Login",
  data() {
    return {
      // 开发者ID
      dvlpId: "",
      // 开发者秘钥
      dvlpSecret: "",
      // 开发者Token
      dvlpToken: "",
      // 是否是私有云
      privateCloud: false,
      // 云平台默认接入服务地址
      accessUrl: "https://access.paas.hst.com",
    };
  },
  methods: {
    /**
     * 登录处理
     */
    async login() {
      if (isEmpty(this.dvlpId)) {
        this.$Message.warning("开发者ID不能为空");
        return;
      }
      if (isEmpty(this.dvlpSecret)) {
        this.$Message.warning("开发者秘钥不能为空");
        return;
      }
      if (this.privateCloud && isEmpty(this.accessUrl)) {
        this.$Message.warning("接入服务地址不能为空");
        return;
      }

      // 保存用户输入
      localStorage.setItem("dvlpId", this.dvlpId);
      localStorage.setItem("dvlpSecret", this.dvlpSecret);
      localStorage.setItem("accessUrl", this.accessUrl);
      localStorage.setItem("privateCloud", this.privateCloud);

      try {
        // 获取登录Token
        await this.getLoginToken();

        // 获取业务网关
        await this.getBusinessGwUrl();

        // 获取Access Token
        await this.getAccessToken();

        // 跳转到主界面
        this.$router.push({ path: "/live/manager" });
      } catch (e) {
        this.$Message.error(e);
      }
    },
    /**
     * 获取登录Token
     */
    async getLoginToken() {
      let self = this;
      return new Promise((resolve, reject) => {
        fetch("https://paas-token-gen.haoshitong.com/generate/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appId: self.dvlpId,
            appSecret: self.dvlpSecret
          }),
          credentials: "omit"
        })
          .then(resp => {
            if (resp.ok){
              return resp.json();
            }
            reject("获取Token失败");
          })
          .then(data => {
            if (data.code == 0 && data.result) {
              self.dvlpToken = data.result;
              resolve();
            } else {
              console.error(data);
              reject("获取Token失败");
            }
          })
          .catch(e => {
            console.error(e);
            reject("获取Token失败");
          });
      });
    },
    /**
     * 获取业务网关
     */
    async getBusinessGwUrl() {
      let self = this;
      return new Promise((resolve, reject) => {
        fetch(self.accessUrl + "/server/address?appType=10", {
          credentials: "omit"
        })
          .then(resp => {
            if (resp.ok) {
              return resp.json();
            }
            reject("获取业务网关失败");
          })            
          .then(data => {
            if (data.result) {
              console.log("Get business gateway result: " +data.result);
              localStorage.setItem("businessGwUrl", data.result);
              resolve();
            } else {
              console.error(JSON.stringify(data));
              reject("获取业务网关失败");
            }
          })
          .catch((e) => {
            console.error(e);
            reject("获取业务网关失败");
          });
      });
    },
    /**
     * 获取访问Token
     */
    async getAccessToken() {
      let self = this;
      return new Promise((resolve, reject) => {
        fetch(localStorage.getItem("businessGwUrl") + "/access/token", {
          method: "GET",
          headers: {
            'Authorization': self.dvlpId + '.' + self.dvlpToken
          }
        })
          .then(resp => {
            if (resp.ok) {
              return resp.json();
            }
            reject("获取Access Token失败");
          })
          .then(data => {
            if (data.code == 0 && data.result) {
              localStorage.setItem("accessToken", data.result.access_token);
              resolve();
            } else {
              console.error(data);
              reject("获取Access Token失败");
            }
          })
          .catch((e) => {
            console.error(e);
            reject("获取Access Token失败");
          });
      });
    }
  },
  mounted() {
    let dvlpId = localStorage.getItem("dvlpId");
    if (!isEmpty(dvlpId)) {
      this.dvlpId = dvlpId;
    }
    let dvlpSecret = localStorage.getItem("dvlpSecret");
    if (!isEmpty(dvlpSecret)) {
      this.dvlpSecret = dvlpSecret;
    }
    let accessUrl = localStorage.getItem("accessUrl");
    if (!isEmpty(accessUrl)) {
      this.accessUrl = accessUrl;
    }
    let privateCloud = localStorage.getItem("privateCloud");
    if (!isEmpty(privateCloud)) {
      this.privateCloud = privateCloud == "true" ? true : false;
    }
  }
};
</script>

<style>
#login {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url("../image/login_bg.jpg");
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-color: #21253b;
}

#login .rec-logo {
  position: relative;
  top: 22px;
  left: 30px;
}

#login .login-form {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #272f50;
  width: 500px;
  /* height: 530px; */
  border-radius: 10px;
  padding: 50px;
}

#login .login-form h2 {
  color: #ffffff;
  font-size: 40px;
  font-weight: lighter;
  margin-bottom: 50px;
}

#login .ivu-input {
  border-radius: 25px;
  background: #ffffff;
  font-size: 14px;
  color: #252830;
}

#login .ivu-btn-primary {
  width: 300px;
  height: 38px;
  border-radius: 25px;
  margin-top: 25px;
}

#login .login-footer {
  position: fixed;
  text-align: center;
  bottom: 49px;
  left: 0;
  right: 0;
  color: #4e598a;
}
</style>
