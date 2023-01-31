import api from "@/utils/api"

/**
 * 导出excel
 * @param url 路径
 * @param params 参数
 * @param fileName 文件名
 */
export const exportExcel = (url, params, fileName) => {
  api.download(url, params).then(response => {
    handleExcel(response, fileName)
  })
}

/**
 * 处理 excel
 * @param response blob 响应对象
 * @param fileName 文件名
 */
export const handleExcel = (response, fileName) => {
  let blob = new Blob([response], { type: 'application/vnd.ms-excel;charset=utf-8' })
  let downloadElement = document.createElement('a');
  let href = window.URL.createObjectURL(blob); //创建下载的链接
  downloadElement.href = href;
  downloadElement.download = fileName + '.xlsx';     //下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click();                     //点击下载
  document.body.removeChild(downloadElement);  //下载完成移除元素
  window.URL.revokeObjectURL(href);            //释放掉blob对象
}
