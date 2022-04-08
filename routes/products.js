const express = require('express');
const { Category } = require('../models/category');
const router = express.Router()
const Product = require('../models/product')
const mongoose = require('mongoose')

router.get(`/`, async (req, res)=> {
    // const productList = await Product.find().select('name image -_id')
    const productList = await Product.find().populate('category')
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.get(`/:id`, async (req, res)=> {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})

router.post(`/`, async (req, res)=> {
    let category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Category does not exist')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save()
    if (!product)
    return res.status(500).send('Product can not be created')

    res.status(201).send(product)
})

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product ID')
    }
    let category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Category does not exist')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )    

    if (!product)
      return res.status(404).send('the product cannot be created')

    res.status(200).send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then((product) => {
        if (product) {
            return res.status(200).json({ success: true, message: 'product was deleted successfully!'})
        } else {
            return res.status(404).json({ success: false, message: 'product not found'})
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err})
    })
})

module.exports = router;
