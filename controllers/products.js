const Products=require ('../models/products')
 
const getAllProductsStatic= async(req,res)=>{
const products = await Products.find({price:{$gt:30}})
.sort('price')
.select('name price')

  res.status(200).json({products, nHits: products.length})
}

const getAllProducts=async(req,res)=>{
  const {featured, company, name, sort, fields, numericfilters}=req.query
  const queryObject={}

  if(featured){
    queryObject.featured = featured === 'true' ? true :false
  }

  if(company){
    queryObject.company=company
  }

  if(name){
    queryObject.name={$regex: name, $options: 'i'}
  }

  if(numericfilters){
    const operatermap={
      '>':'$gt',
      '>=':'$gte',
      '=':'$eq',
      '<':'$lt',
      '<=':'$lte',
    }
    const regEx=/\b(<|>|>=|=|<|<=)\b/g
    let filters=numericfilters.replace(
      regEx,
      (match)=>`-${operatermap[match]}-`
    )
  const opitions=['price', 'rating'];
  filters=filters.split(',').forEach((item) => {
    const [fileds,operator,value]=item.split('-')
    if(opitions.includes(fields)){
      queryObject[fields]={[operator]:Number(value)}

    }
  });
  }
let result =   Products.find(queryObject)
//sort
if(sort){
const sortedList=sort.split(',').join(' ')
result = result.sort(sortedList)

} else{
  result=result.sort('createdAt')
}

if(fields){
  const fieldsList=fields.split(',').join(' ')
result = result.select(fieldsList)
}

const page = Number(req.query.page) || 1
const limit = Number(req.query.limit) || 10
const skip =(page-1)*limit
result =result.skip(skip).limit(limit)


const products = await result
  res.status(200).json({products, nHits: Products.length})
}

module.exports={
  getAllProductsStatic,
  getAllProducts,
}