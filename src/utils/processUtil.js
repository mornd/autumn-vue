import api from "@/utils/api"

/**
 * 下载流程定义文件
 * @param response
 * @param fileName
 */
export const downloadProcessFile = (url, fileName) => {
  api.download(url).then(response => {
    handleProcessFile(response, fileName)
  })
}

/**
 * 处理流程定义文件
 * @param response
 * @param filename
 */
export const handleProcessFile = (response, filename) => {
  const blob = new Blob([response]);
  let downloadElement = document.createElement("a");
  downloadElement.href = window.URL.createObjectURL(blob);
  downloadElement.download = decodeURIComponent(filename);
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(downloadElement.href);
}
