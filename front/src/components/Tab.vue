<template>
    <div class="tab-container">
      <div class="tab-header">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab', { active: activeTab === tab.value }]"
          @click="selectTab(tab.value)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name:"TabComponent",
    data() {
      return {
        activeTab: this.tabs[0].value,
      };
    },
    props: {
      tabs: {
        type: Array,
        required: true,
      },
    },
    methods: {
      selectTab(val) {
        this.activeTab = val;
        this.$emit('change-tab', val)
      },
    },
  };
  </script>
  
  <style scoped>
  .tab-container {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
  .tab-header {
    display: flex;
    background: #f4f4f4;
    border-bottom: 1px solid #ccc;
  }
  .tab {
    padding: 10px 15px;
    cursor: pointer;
    flex: 1;
    text-align: center;
    background: #f4f4f4;
    border-right: 1px solid #ccc;
  }
  .tab:last-child {
    border-right: none;
  }
  .tab.active {
    background: #fff;
    font-weight: bold;
  }
  .tab-content {
    padding: 15px;
    background: #fff;
  }
  </style>
  