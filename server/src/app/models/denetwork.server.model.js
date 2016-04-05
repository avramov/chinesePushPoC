/**
 * Created by U324210 on 22-03-2016.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DEHistorySchema = new Schema({
    timestamps: [Number],
    actualflow: [Number],
    actualenergy: [Number],
    outdoortemp: [Number]
});

mongoose.model('DEHistory', DEHistorySchema);

var DENetworkSchema = new Schema({
    _id: String,
    id: String,
    name: {
        type: String,
        trim: true,
        required: false
    },
    optimizationtype: {
        type: String,
        trim: true,
        required: false
    },
    history: {
        frequency1: {
            type: Schema.Types.ObjectId,
            ref: 'DEHistory'
        },
        frequency2: {
            type: Schema.Types.ObjectId,
            ref: 'DEHistory'
        },
        frequency3: {
            type: Schema.Types.ObjectId,
            ref: 'DEHistory'
        },
        frequency4: {
            type: Schema.Types.ObjectId,
            ref: 'DEHistory'
        },
        frequency5: {
            type: Schema.Types.ObjectId,
            ref: 'DEHistory'
        }
    }
});

mongoose.model('DENetwork', DENetworkSchema);