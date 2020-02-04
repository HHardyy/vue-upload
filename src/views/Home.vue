<template>
  <div class="home">
    <div style="height:200px;">
      <p>原生分片demo，对应后端启动命令npm run serve1</p>
      <UploadFile></UploadFile>
    </div>
    <hr>
    <div>
      <p>vue-simple-uploader,对应后端启动命令npm run serve2</p>
      <UploadVueSimpleUploader></UploadVueSimpleUploader>
    </div>
  </div>
</template>
<script>
import UploadFile from '@/components/upload-file'
import UploadVueSimpleUploader from '@/components/upload-vue-simple-uploader'
export default {
  components: {
    UploadFile,
    UploadVueSimpleUploader
  }
}
</script>
<style scoped>
p {
  color: #3f51b5;
}
</style>
