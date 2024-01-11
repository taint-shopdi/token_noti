const _ = require('lodash');

class MongoFuncHelper {
  /** Create entity model
   * @output object model created
   * @param model current model working
   * @param entParam object entity model need to create*/
  save(model, entParam) {
    return model.create(entParam);
  }

  /** Get list entity model paging - usually use for web logic
   * @output array entity model
   * @param model current model working
   * @param query object contains query props
   * @param sort object contains sort props
   * @param pageIndex int current page
   * @param limit int number records need to get every page
   * @param select object contains props name need to get*/
  async listPaging(model, query = {}, sort = {}, pageIndex = 0, limit = 20, select = {}) {
    pageIndex = Number.parseInt(pageIndex, 10);
    limit = Number.parseInt(limit, 10);
    if (Number.isNaN(pageIndex)) {
      pageIndex = 0;
    }
    if (Number.isNaN(limit)) {
      limit = 20;
    }
    pageIndex = pageIndex >= 1 ? pageIndex - 1 : 0;
    if (!pageIndex || pageIndex < 0) {
      pageIndex = 0;
    }
    if (!limit || limit < 0 || limit > 1000) {
      limit = 20;
    }
    const options = {
      select,
      offset: pageIndex * limit,
      limit,
      sort
    };
    const response = await model.paginate(query, options);
    return {
      data: response.docs,
      totalDocs: response.totalDocs
    };
  }
}

module.exports = MongoFuncHelper;
