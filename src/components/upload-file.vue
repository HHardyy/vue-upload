<template>
  <div>
    <div>
        <input
          type="file"
          ref="file"
          @change="fileChange"
        >
      </div>

    <div class="process-wrap">
      <div class="progress"><span :style="style"></span>校验进度：{{checkProcessStyle}}</div>
    </div>

    <br>

    <div class="process-wrap">
      <div class="progress"><span :style="style1"></span>上传进度：{{uploadProcessStyle}}</div>
    </div>
  </div>
</template>

<script>
let SparkMD5 = require('spark-md5')

export default {
  data () {
    return {
      checkProcessStyle: 0,
      uploadProcessStyle: 0,
      baseUrl: 'http://localhost:3000',
      chunkSize: 5 * 1024 * 1024,
      fileSize: 0,
      file: null,
      hasUploaded: 0,
      chunks: 0
    }
  },
  computed: {
    style () {
      return {
        width: this.checkProcessStyle + '%'
      }
    },
    style1 () {
      return {
        width: this.uploadProcessStyle + '%'
      }
    }
  },
  methods: {
    /* 选择文件 */
    fileChange () {
      this.file = this.$refs.file.files[0]
      this.fileSize = this.file.size
      this.resChange(this.file)
    },
    async resChange (file) {
      // 第一步：按照 修改时间+文件名称+最后修改时间计算MD5
      let fileMd5Value = await this.md5File(file)
      // 第二步：校验文件的MD5
      let result = await this.checkFileMD5(file.name, fileMd5Value)
      // 如果文件已存在, 就秒传
      if (result.file) {
        console.log('文件已存在，秒传')
        return false
      }
      // 显示上传进度
      this.uploadProcessStyle = '100%'
      // 第三步：检查并上传MD5
      await this.checkAndUploadChunk(fileMd5Value, result.chunkList)
      // 第四步: 通知服务器所有分片已上传完成
      this.notifyServer(fileMd5Value)
    },
    /*  1、修改时间 + 文件名称 + 最后修改时间 => MD5 */
    md5File (file) {
      let _this = this
      return new Promise((resolve, reject) => {
        let blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice
        let currentChunk = 0
        let _spark = new SparkMD5.ArrayBuffer()
        let _fileReader = new FileReader() // H5强大的File Api
        let _chunks = 100
        let _chunkSize = file.size / 100
        _this.chunks = _chunks
        _this.chunkSize = _chunkSize

        /* 读文件 */
        _fileReader.onload = function (e) {
          console.log('read chunk nr', currentChunk + 1, 'of', _chunks)
          _spark.append(e.target.result)
          currentChunk++
          if (currentChunk < _chunks) {
            loadNext()
          } else {
            let curr = +new Date()
            console.log('上传完成')
            let result = _spark.end()
            resolve(result)
          }
        }
        /* 出错 */
        _fileReader.onerror = function () {
          console.warn('something went wrong!!!!')
        }

        function loadNext () {
          let start = currentChunk * _chunkSize
          let end =
            start + _chunkSize >= file.size ? file.size : start + _chunkSize
          _fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
          _this.checkProcessStyle = currentChunk + 1 + '%'
        }
        loadNext()
      })
    },
    /*  2、校验文件的MD5 */
    checkFileMD5 (fileName, fileMd5Value) {
      let _this = this
      return new Promise((resolve, reject) => {
        let url = `${_this.baseUrl}/check/file?fileName=${fileName}&fileMd5Value=${fileMd5Value}`
        _this._$.getJSON(url, function (data) {
          resolve(data)
        })
      })
    },
    /* 3.1、上传chunk */
    async checkAndUploadChunk (fileMd5Value, chunkList) {
      this.chunks = Math.ceil(this.fileSize / this.chunkSize)
      this.hasUploaded = chunkList.length

      for (let i = 0; i < this.chunks; i++) {
        let exit = chunkList.indexOf(i + '') > -1
        // 如果已经存在, 则不用再上传当前块
        if (!exit) {
          let index = await this.upload(i, fileMd5Value, this.chunks)
          this.hasUploaded = this.hasUploaded + 1
          let radio = Math.floor((this.hasUploaded / this.chunks) * 100)
          this.uploadProcessStyle = radio + '%'
        }
      }
    },
    /* 3.2上传chunk2 */
    upload (i, fileMd5Value, chunks) {
      let _this = this
      return new Promise((resolve, reject) => {
        let end =
          (i + 1) * _this.chunkSize >= _this.file.size
            ? _this.file.size
            : (i + 1) * _this.chunkSize
        let _formData = new FormData() // 构造表单
        _formData.append('data', _this.file.slice(i * _this.chunkSize, end)) // 切出文件的一部分
        _formData.append('total', _this.chunks) // 总片数
        _formData.append('index', i) // 当前是第几片
        _formData.append('fileMd5Value', fileMd5Value)
        _this._$.ajax({
          url: `${_this.baseUrl}/upload`,
          type: 'POST',
          data: _formData,
          async: true,
          processData: false,
          contentType: false,
          success: function (data) {
            resolve(data.desc)
          }
        })
      })
    },
    /* 4、通知服务器所有分片上传完成 */
    notifyServer (fileMd5Value) {
      let url = `${this.baseUrl}/merge?md5=${fileMd5Value}&fileName=${this.file.name}&size=${this.file.size}`
      this._$.getJSON(url, function (data) {
        alert('上传成功')
      })
    }
  }
}
</script>

<style scoped lang="stylus">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.process-wrap {
  width: 300px;
  p {
    width: 100%;
  }
  .progress {
    background: #c5c8ce;
    height: 20px;
    position: relative;
    span {
      display: block;
      background: #19be6b;
      height: 100%;
      width: 0;
    }
  }
}
</style>
