/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HeatplantHistorySchema = new Schema({
    timestamps: [Number],
    actualflow: [Number],
    actualenergy: [Number],
    supplytemp: [Number],
    returntemp: [Number]
});

mongoose.model('HeatplantHistory', HeatplantHistorySchema);

var HeatplantSchema = new Schema({
    _id: String,
    id: String,
    name: {
        type: String,
        trim: true,
        required: false
    },
    branchname: {
        type: String,
        trim: true,
        required: false
    },
    address: {
        type: String,
        trim: true,
        required: false
    },
    long: Number,
    lat: Number,
    plannedflow: Number,
    actualflow: Number,
    plannedenergy: Number,
    actualenergy: Number,
    denetwork: {
        type: String,
        trim: true,
        required: false
    },
    history: {
        frequency1: {
            type: Schema.Types.ObjectId,
            ref: 'HeatplantHistory'
        },
        frequency2: {
            type: Schema.Types.ObjectId,
            ref: 'HeatplantHistory'
        },
        frequency3: {
            type: Schema.Types.ObjectId,
            ref: 'HeatplantHistory'
        },
        frequency4: {
            type: Schema.Types.ObjectId,
            ref: 'HeatplantHistory'
        },
        frequency5: {
            type: Schema.Types.ObjectId,
            ref: 'HeatplantHistory'
        }
    }
});

mongoose.model('Heatplant', HeatplantSchema);