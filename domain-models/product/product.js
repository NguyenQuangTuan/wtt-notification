// const Variant = require('./variant')

const Product = function (params) {
  let self = this
  let props = Object.assign({
    rating_average: 0,
    total_review: 0,
    tag: [],
    shows: true
  }, params)
  let price_obj = handler_price(props.variants)

  self.images = props.images
  self.thumbnail = props.thumbnail
  self.rating_average = props.rating_average
  self.total_review = props.total_review
  self.description = props.description
  self.short_description = props.short_description
  self.variants = handler_variant(props.variants)
  self.title = props.title
  self.tags = props.tags
  self.price = price_obj.price
  self.compared_price = price_obj.compared_price
  self.options = handler_options(props.variants)
  self.shows = props.shows
}
const handler_price = (variants) => {
  let price = variants[0].price
  let compared_price = variants[0].compared_price

  variants.map(v => {
    if (v.price < price) {
      price = v.price
      compared_price = v.compared_price
    }
  })

  return { price, compared_price }
}

const handler_variant = (variants) => {
  return variants.map(v => new Variant(v))
}

const handler_options = (variants) => {
  if (!variants[0].properties) {
    return []
  }
  else {
    let property_keys = Object.keys(variants[0].properties)
    let options = {}

    property_keys.map(key => {
      options[key] = []
    })

    variants.map(v => {
      property_keys.map(key => {
        if (v.properties[key])
          options[key].push(v.properties[key])
      })
    })

    property_keys.map(key => {
      options[key] = [...new Set(options[key])]
    })

    return options
  }
}

module.exports = Product
