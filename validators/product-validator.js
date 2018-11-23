const errors_aggregator = require('./errors-aggregator')
const Validator = require('fastest-validator')

const validator = new Validator()

// Schemas
let product = {
  type: 'object',
  props: {
    images: {
      min: 1,
      type: 'array',
      items: {
        type: 'string'
      }
    },
    thumbnail: { type: 'string' },
    rating_average: { type: 'number', optional: true },
    total_review: { type: 'number', integer: true, optional: true },
    description: { type: 'string' },
    short_description: { type: 'string' },
    tags: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    variants: {
      min: 1,
      type: 'array',
      items: {
        type: 'object',
        props: {
          price: { type: 'number' },
          compared_price: { type: 'number' },
          properties: { type: 'object', optional: true },
          quantity: { type: 'number', integer: true },
          image_url: { type: 'string' },
        }
      }
    }
  }

}

// Validators
let validate_product = validator.compile({ product })

module.exports = {
  validate_product: (request) => {
    return errors_aggregator.aggregate(validate_product(request))
  }
}