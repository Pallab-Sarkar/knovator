const express = require('express')
const router = express.Router()
const userService = require('../services/userService')
const { handleError } = require('../utils/utils')
const isAuthenticate = require('../services/tokenService');
const multipartMiddleware = require('connect-multiparty')();

router.post('/getUserListByCondn', isAuthenticate, (req,res) => {
    userService.getUserListByCondn(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "User list fetched Successfully", data: result });
    }).catch(handleError(res))

})

router.post('/getAllListwithSpecificField', isAuthenticate, (req,res) => {
    userService.getAllListwithSpecificField(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "User list fetched Successfully", data: result });
    }).catch(handleError(res))

})

router.get('/getById/:id',isAuthenticate,(req,res) => {


    userService.getUser(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "User fetched Successfully", data: result });
    }).catch(handleError(res))


})

router.put('/update/:id', isAuthenticate, multipartMiddleware, (req,res) => {

    userService.updateUser(req, req.params.id, req.body).then(result => {
        res.status(200).json({ success: true, message: "User updated Successfully", data: result });
    }).catch(handleError(res))

})

router.delete('/delete/:id', isAuthenticate, (req,res) => {

    userService.deleteUser(req, req.params.id).then(result => {
        res.status(200).json({ success: true, message: "User deleted Successfully", data: result });
    }).catch(handleError(res))

})

router.get('/getAllNotifications',isAuthenticate, (req,res) => {

    userService.getAllNotifications(req).then(result => {
        res.status(200).json({ success: true, message: "Notifications fetched Successfully", data: result });
    }).catch(handleError(res))

})

router.put('/setFCM/:id',isAuthenticate, (req,res) => {

    userService.setFCM(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "FCM added Successfully", data: result });
    }).catch(handleError(res))

})

router.put('/clearSelNotification/:id/:nId',isAuthenticate, (req,res) => {

    userService.clearSelNotification(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "Cleared Successfully", data: result });
    }).catch(handleError(res))

})

router.put('/clearAllNotifications/:id',isAuthenticate, (req,res) => {

    userService.clearAllNotifications(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "Cleared Successfully", data: result });
    }).catch(handleError(res))

})

router.put('/markSelNotificationRead/:id/:nId',isAuthenticate, (req,res) => {

    userService.markSelNotificationRead(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "Read Successfully", data: result });
    }).catch(handleError(res))

})

router.put('/markAllNotificationRead/:id',isAuthenticate, (req,res) => {

    userService.markAllNotificationRead(req,req.body).then(result => {
        res.status(200).json({ success: true, message: "Read Successfully", data: result });
    }).catch(handleError(res))

})

module.exports = router