const User = require("../models/User");
const Person = require("../models/Person");

const mongoose = require("mongoose");



//get selected Profile information 
const checkUserInfo= async(req,res)=>{
    User.findById(req.params.id).populate('person')
    .then(person => {
        console.log('All users:', person);
        return     res.json(person);

    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}
//update status (accepted,pending,refused)
const updateStatus = async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(req.params.id, { status: req.params.status }, { new: true });
        return res.json({
            'Document updated successfully:': result
        });
    } catch (error) {
        return res.json({
            'Error updating:': error
        });
    }
}



module.exports={
    checkUserInfo,
    updateStatus
}