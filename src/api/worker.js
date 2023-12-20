import http from '@/utils/request'
export default {
  /**
   * 查询职工列表
   * @returns
   */
  async getWorkerListApi(params) {
    return await http.get("/api/worker/list", params);
  },
  /**
   * 添加职工
   * @returns
   */
  async addWorkerApi(params) {
    return await http.post("/api/worker/add", params);
  },
  /**
   * 编辑职工
   * @returns
   */
  async updateWorkerApi(params) {
    return await http.put("/api/worker/update", params);
  },
  /**
   * 删除职工
   * @returns
   */
  async deleteWorker(params) {
    return await http.delete("/api/worker/delete", params);
  }
}
