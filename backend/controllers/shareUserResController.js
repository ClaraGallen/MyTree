const User = require("../models/User");

const shareUserRest=async(req,res)=>{
        try {
            const result = await User.findByIdAndUpdate(req.params.id, { role: req.params.role }, { new: true });
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
shareUserRest
}