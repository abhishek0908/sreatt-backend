import express from "express";
import Warranty from '../db/warrantySchema.js'
const app = express();
const PORT = 3000;


// Middleware to parse JSON
app.use(express.json());
export const validateWarrantyInput = (data) => {
    const errors = {};
    
    if (!data.dealerName?.trim()) errors.dealerName = "Dealer name is required";
    if (!data.address?.trim()) errors.address = "Address is required";
    if (!data.customerName?.trim()) errors.customerName = "Customer name is required";
    
    // Validate phone number (10 digits)
    if (!data.customerMobileNumber?.match(/^\d{10}$/)) {
      errors.customerMobileNumber = "Please enter a valid 10-digit mobile number";
    }
    
    if (!data.vehicleType?.trim()) errors.vehicleType = "Vehicle type is required";
    if (!data.batteryModelNumber?.trim()) errors.batteryModelNumber = "Battery model number is required";
    if (!data.batterySerialNumber?.trim()) errors.batterySerialNumber = "Battery serial number is required";
    if (!data.dateOfPurchase) errors.dateOfPurchase = "Date of purchase is required";
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Backend: warrantyController.js
  export const registerWarranty = async (req, res) => {
      try {
          const validation = validateWarrantyInput(req.body);
          
          if (!validation.isValid) {
              return res.status(400).json({
                  status: 'error',
                  message: "Validation failed",
                  errors: validation.errors
              });
          }
  
          const {
              dealerName,
              address,
              customerName,
              customerMobileNumber,
              vehicleType,
              batteryModelNumber,
              batterySerialNumber,
              dateOfPurchase,
          } = req.body;
  
          // Check if warranty already exists
          const existingWarranty = await Warranty.findOne({ batterySerialNumber });
          if (existingWarranty) {
              return res.status(409).json({
                  status: 'error',
                  message: "Warranty with this serial number already exists"
              });
          }
  
          const newWarranty = new Warranty({
              dealerName,
              address,
              customerName,
              customerMobileNumber,
              vehicleType,
              batteryModelNumber,
              batterySerialNumber,
              dateOfPurchase,
          });
  
          const savedWarranty = await newWarranty.save();
          res.status(201).json({
              status: 'success',
              message: "Warranty registered successfully",
              data: savedWarranty,
          });
      } catch (error) {
          console.error('Warranty registration error:', error);
          res.status(500).json({
              status: 'error',
              message: "Failed to register warranty",
              error: error.message
          });
      }
  };
  
  export const viewWarranty = async (req, res) => {
      try {
          const { phoneNumber, serialNumber } = req.query;
  
          if (!phoneNumber && !serialNumber) {
              return res.status(400).json({
                  status: 'error',
                  message: "Please provide either phone number or serial number"
              });
          }
  
          let warranty;
          if (phoneNumber) {
              if (!phoneNumber.match(/^\d{10}$/)) {
                  return res.status(400).json({
                      status: 'error',
                      message: "Please provide a valid 10-digit phone number"
                  });
              }
              warranty = await Warranty.findOne({ customerMobileNumber: phoneNumber });
          } else if (serialNumber) {
              warranty = await Warranty.findOne({ batterySerialNumber: serialNumber });
          }
  
          if (!warranty) {
              return res.status(404).json({
                  status: 'error',
                  message: phoneNumber 
                      ? "No warranty found for this phone number" 
                      : "No warranty found for this serial number"
              });
          }
  
          res.status(200).json({
              status: 'success',
              message: "Warranty found",
              data: warranty,
          });
      } catch (error) {
          console.error('Warranty retrieval error:', error);
          res.status(500).json({
              status: 'error',
              message: "Failed to retrieve warranty information",
              error: error.message
          });
      }
  };

  export const updateWarranty = async (req, res) => {
    try {
        const { batterySerialNumber, warrantyStatus } = req.body;

        if (!batterySerialNumber?.trim()) {
            return res.status(400).json({
                status: 'error',
                message: "Battery serial number is required"
            });
        }

        if (!warrantyStatus) {
            return res.status(400).json({
                status: 'error',
                message: "warrantyStatus is required"
            });
        }

        const updatedWarranty = await Warranty.findOneAndUpdate(
            { batterySerialNumber },
            { $set: { warrantyStatus } },
            { new: true }
        );

        if (!updatedWarranty) {
            return res.status(404).json({
                status: 'error',
                message: "No warranty found with the given serial number"
            });
        }

        return res.status(200).json({
            status: 'success',
            message: "Warranty updated successfully",
            data: updatedWarranty
        });

    } catch (error) {
        console.error('Warranty update error:', error);
        return res.status(500).json({
            status: 'error',
            message: "Failed to update warranty",
            error: error.message
        });
    }
};
