class APIFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.querystr };

    console.log(queryCopy);
    //removing fields from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    //advance filter for pricing
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\/b/g,
      (match) => `$${match}`
    );
    console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //paginate
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page || 1);
    const skip = (currentPage - 1) * resPerPage;
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
