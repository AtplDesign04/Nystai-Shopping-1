const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            mediaType: {
                type: String,
                enum: ['image', 'video'],
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                'NVR',
                'SMART HOME',
                'SENSORS',
                'CAMERAS',
                'OTHERS',
            ],
            message : "Please select correct category"
        }
    },
    subcategory: {
        type: String,
        required: [true, "Please enter product Sub category"],
        enum: {
            values: [
        'test1',
        'test2',
        'test3',
        'test13', 'test14', 'test15',
        'test22', 'test23', 'test24',
        'test25', 'test26', 'test27',
        'test28', 'test29', 'test30'
                
            ],
            message : "Please select correct category"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [20, 'Product stock cannot exceed 20']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: {
        type: String,
    },
    itemModelNum: {
        type: String,
    },
    serialNum: {
        type: String,
    },
    connectionType: {
        type: String,
    },
    hardwarePlatform: {
        type: String,
    },
    os: {
        type: String,
    },
    powerConception: {
        type: String,
    },
    batteries: {
        type: String,
    },
    packageDimension: {
        type: String,
    },
    portDescription: {
        type: String,
    },
    connectivityType: {
        type: String,
    },
    compatibleDevices: {
        type: String,
    },
    powerSource: {
        type: String,
    },
    specialFeatures: {
        type: String,
    },
    includedInThePackage: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    itemSize: {
        type: String,
    },
    itemWidth: {
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

let schema = mongoose.model('Product', productSchema)

module.exports = schema