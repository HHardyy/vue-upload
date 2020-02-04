<template>
  <uploader
    :options="options"
    :file-status-text="statusText"
    @file-complete="fileComplete"
    @complete="complete"
    class="uploader-example"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>请将文件拖拽到这里，或者</p>
      <uploader-btn>请选择文件</uploader-btn>
      <uploader-btn :attrs="attrs">请选择图片</uploader-btn>
      <uploader-btn :directory="true">请选择目录</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
</template>

<script>
export default {
  data () {
    return {
      options: {
        target: 'http://127.0.0.1:3000/upload',
        chunkSize: 5 * 1024 * 1024,
        testChunks: false // 是否开启服务器分片校验
      },
      attrs: {
        accept: 'image/*'
      },
      statusText: {
        success: '上传成功',
        error: '上传出错了',
        uploading: '正在上传',
        paused: '暂停中',
        waiting: '等待中'
      }
    }
  },
  methods: {
    complete () {
      console.log('上传完成 complete', arguments)
    },
    fileComplete () {
      console.log('文件上传完成 complete', arguments)
    }
  }
}
</script>

<style scoped>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
