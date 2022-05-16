// base - product.find()
//bigQ - //search=coder&page=2&catagory=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199

class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $option: 'i'
            }
        } : {}

        this.base = this.base.find({ ...searchword })
        return this;
    }

    filter() {
        // deleting this words from url for filtering purpose
        // copy the quary and add $ sign mongoose aggregation to check greater then , less then such an operation
        const copyQ = { ...this.bigQ }
        delete copyQ['search']
        delete copyQ['limit']
        delete copyQ['page']

        // conver query into string
        let stringOfCopyQ = JSON.stringify(copyQ)
        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)

        const jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base = this.base.find(jsonOfCopyQ)
        return this
    }

    pager(resultperPage) {
        // pagination feature [currentPage and skipPage functionality]
        let currentPage = 1;
        if (this.bigQ.page) {
            currentPage = this.bigQ.page
        }

        const skipval = resultperPage * (currentPage - 1)


        this.base.limit(resultperPage).skip(skipval)

     }
}

module.exports = WhereClause