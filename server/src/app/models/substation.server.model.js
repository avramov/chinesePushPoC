/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubstationHistorySchema = new Schema({
    timestamps: [Number],
    plannedflow: [Number],
    actualflow: [Number],
    plannedenergy: [Number],
    actualenergy: [Number],
    supplytemp: [Number],
    returntemp: [Number]
});

mongoose.model('SubstationHistory', SubstationHistorySchema);

var SubstationSchema = new Schema({
    _id: String,
    name: {
        type: String,
        trim: true,
        required: false
    },
    macaddress: {
        type: String,
        trim: true,
        required: true
    },
    branchname: {
        type: String,
        trim: true,
        required: false
    },
    status: Number,
    kvm: Number,
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
            required: false,
            ref: 'SubstationHistory'
        },
        frequency2: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'SubstationHistory'
        },
        frequency3: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'SubstationHistory'
        },
        frequency4: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'SubstationHistory'
        },
        frequency5: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'SubstationHistory'
        }
    }
});

mongoose.model('Substation', SubstationSchema);