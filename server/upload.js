const express = require('express')
const cors = require('cors')
const multer = require('multer')

const port = 3000
const app = express()

app.use(cors())
const upload = multer({
  dest: './upload'
})

// 处理文件上传的请求
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file)
  res.json({
    file: req.file
  })
})

app.listen(port, () => {
  console.log('服务器启动成功，监听端口3000')
})
