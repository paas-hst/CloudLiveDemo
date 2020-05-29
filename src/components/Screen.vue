<template>
  <div id="screen-list">
    <div v-show="userList.length==0 || userList.length > 4" class="screen-zero"></div>
    <div v-show="userList.length==1" class="screen-one">
      <div class="screen">
        <p class="name">{{this.userList[0]}}</p>
      </div>
    </div>
    <div v-show="userList.length==2" class="screen-two">
      <div class="screen">
        <p class="name">{{this.userList[0]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[1]}}</p>
      </div>
    </div>
    <div v-show="userList.length==3" class="screen-three">
      <div class="screen">
        <p class="name">{{this.userList[0]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[1]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[2]}}</p>
      </div>
    </div>
    <div v-show="userList.length==4" class="screen-four">
      <div class="screen">
        <p class="name">{{this.userList[0]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[1]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[2]}}</p>
      </div>
      <div class="screen">
        <p class="name">{{this.userList[3]}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    userList: Array,
    default: []
  }
};
</script>

<style scoped>
#screen-list div[class^="screen-"] {
  display: flex;
  flex-wrap: wrap;
  width: 825px;
  height: 422px;
  /* margin-bottom: 30px; */
  border: 1px solid #000;
  background: #1a1b21;
}

#screen-list .screen {
  color: #ffffff;
  display: inline-block;
  background: rgb(205, 233, 254);
  border-bottom: 1px solid #000;
  position: relative;
}

#screen-list .screen .name {
  position: absolute;
  top: 15px;
  left: 15px;
  border-radius: 20px;
  padding: 5px 8px;
  background: rgba(0, 0, 0, 0.3);
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.screen-one .screen {
  width: 100%;
  height: 100%;
}

.screen-two .screen {
  width: 50%;
  height: 100%;
}

.screen-three .screen {
  width: 50%;
  height: 50%;
}

.screen-four .screen {
  width: 50%;
  height: 50%;
}

#screen-list .screen:nth-child(odd) {
  border-right: 1px solid #000;
}
</style>
