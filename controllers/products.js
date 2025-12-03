const Product = require('../models/product');
const getAllProductsStatic = async(req , res)=>{
        const products = await Product.find({featured:true});
        res.status(200).json({amount:products.length, products });
};

const getAllProducts = async(req, res)=>{
        const {featured , company , name , sort , fields , numericFilters} = req.query;
        const queryObject = {};
        if(featured)
        {
                queryObject.featured = featured === 'true' ? true : false;
        }
        if(company)
        {
                queryObject.company = company;
        } 
        if(name)  
        {
                queryObject.name = {$regex: name , $options: 'i'};
        }
        let products =  Product.find(queryObject);

        if(numericFilters)
        {
                const operatorMap = {
                        '>':'$gt',
                        '>=':'$gte',
                        '=':'$eq',
                        '<':'$lt',
                        '<=':'$lte',
                }
                const regEx = /\b(<|>|>=|=|<|<=)\b/g;
                let filters = numericFilters.replace(regEx , (match)=>{
                        return `-${operatorMap[match]}-`;   
                });
                const options = ['price' , 'rating'];
                filters.split(',').forEach((option)=>{
                        const[field , operator , value] = option.split('-');
                        if(options.include(field)){
                                queryObject[field] = {[operator]: Number(value)};
                        }
                });
        }

        //sort
        if(sort)
        {
                const sortList = sort.split(',').join(' ');
                products =  products.sort(sortList);
        }else{
                products =  products.sort('createdAt');
        }
        //fields
        if(fields)
        {
                const fieldsList = fields.split(',').join(' ');
                products = products.select(fieldsList);
        }
        //limit and skip and page

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        result = result.skip(skip).limit(limit);
        if(limit)
        {
                products = products.limit(Number(limit));
        }
        products = await products;
        res.status(200).json({amount:products.length , products});
};

module.exports = {getAllProductsStatic , getAllProducts};