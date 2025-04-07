import mongoose from "mongoose";
import {VehicleTypeEnum,WarrantyStatusEnum} from '../utils/constants.js'

const warrantySchema = mongoose.Schema({
    dealerName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        required: true,
    },
    customerMobileNumber: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: Object.values(VehicleTypeEnum),
        required: true,
    },
    batteryModelNumber : {
        type :String,
        require :true
    },
    batterySerialNumber :{
        type :String,
        require :true
    },
    dateOfPurchase: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Date of purchase cannot be in the future.",
        },
        
    },
    warrantyStatus: {
        type: String,
        enum: Object.values(WarrantyStatusEnum),
        default: WarrantyStatusEnum.PENDING,
        required: true
    }
});


// Export the schema and enum
export default mongoose.model('Warranty', warrantySchema);
