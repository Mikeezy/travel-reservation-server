module.exports = function (req,res,next){

    return res.status(200).json({
        success : false,
        code : "NOT FOUND",
        message : "Not found, please retry !"
    })

}