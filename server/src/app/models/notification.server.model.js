/**
 * Created by U324210 on 22-03-2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    _id: String,
    deviceid: {
        type: String,
        trim: true,
        required: false
    },
    devicetype: {
        type: Number
    },
    name: {
        type: String,
        trim: true,
        required: false
    },
    text: {
        type: String,
        trim: true,
        unique: true,
        required: false
    },
    severity: {
        type: Number,
        required: false
    },
    timestamp: {
        type: Number,
        required: false
    },
    denetwork: {
        type: String,
        trim: true,
        required: false
    }
});

mongoose.model('Notification', NotificationSchema);