const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


/**
 * Token Options
 * */
const tokenService = require('../services/token.service');

/**
 * User Options
 * */
const userService = require('../services/user.service');

//POST /api/v1/users
router.post('/users', jsonParser, function (req, res) {
    userService.addUser(req.body)
        .then(
            user => {res.json(user)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/users/query
router.post('/users/query', jsonParser, function (req, res) {
    userService.getUsers(req.body)
        .then(
            restaurants => res.json(restaurants),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/users
//NEED AUTH
router.put('/users', jsonParser, function (req, res) {
    userService.updateUser(req.body)
        .then(
            user => {res.json(user)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/users/:userId
router.get('/users/:id',function (req, res) {
    const userId = req.params.id;
    userService.getUser(userId)
        .then(
            user => res.json(user),
            error => {res.status(400).send(error);});
});

/**
 * Restaurant Options
 * */
const restaurantService = require('../services/restaurant.service');

//POST /api/v1/restaurants
//NEED AUTH
router.post('/restaurants', jsonParser, function (req, res) {
    restaurantService.addRestaurant(req.body)
        .then(
            restaurant => {res.json(restaurant)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/restaurants/query
router.post('/restaurants/query', jsonParser, function (req, res) {
    restaurantService.getRestaurants(req.body)
        .then(
            restaurants => res.json(restaurants),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/restaurants
//NEED AUTH
router.put('/restaurants', jsonParser, function (req, res) {
    restaurantService.updateRestaurant(req.body)
        .then(
            restaurant => {res.json(restaurant)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/restaurants/:ownerId
router.get('/restaurants/:ownerId',function (req, res) {
    const ownerId = req.params.ownerId;
    restaurantService.getRestaurant(ownerId)
        .then(
            restaurant => res.json(restaurant),
            error => {res.status(400).send(error);});
});

/**
 * Payment Options
 * */
const paymentService = require('../services/payment.service');

//POST /api/v1/payments/query
router.post('/payments/query', jsonParser, function (req, res) {
    paymentService.getPayments(req.body)
        .then(
            payments => res.json(payments),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/payments
//NEED AUTH
router.put('/payments', jsonParser, function (req, res) {
    paymentService.updatePayment(req.body)
        .then(
            payments => {res.json(payments)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/payments
//NEED AUTH
router.post('/payments', jsonParser, function (req, res) {
    paymentService.addPayment(req.body)
        .then(
            payment => {res.json(payment)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/payments/:paymentId
router.get('/payments/:paymentId',function (req, res) {
    const paymentId = req.params.paymentId;
    paymentService.getPayment(paymentId)
        .then(
            payment => res.json(payment),
            error => {res.status(400).send(error);});
});

/**
 * Rating Options
 * */
const ratingService = require('../services/rating.service');

//POST /api/v1/ratings/query
router.post('/ratings/query', jsonParser, function (req, res) {
    ratingService.getRatings(req.body)
        .then(
            ratings => res.json(ratings),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/ratings
//NEED AUTH
router.put('/ratings', jsonParser, function (req, res) {
    ratingService.updateRating(req.body)
        .then(
            ratings => {res.json(ratings)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/ratings
//NEED AUTH
router.post('/ratings', jsonParser, function (req, res) {
    ratingService.addRating(req.body)
        .then(
            ratings => {res.json(ratings)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/ratings/:ratingId
router.get('/ratings/:ratingId',function (req, res) {
    const ratingId = req.params.ratingId;
    ratingService.getRating(+ratingId)
        .then(
            rating => res.json(rating),
            error => {res.status(400).send(error);});
});

/**
 * Favorite Options
 * */
const favoriteService = require('../services/favorite.service');

//POST /api/v1/favorites
//NEED AUTH
router.post('/favorites', jsonParser, function (req, res) {
    favoriteService.addFavorite(req.body)
        .then(
            stories => {res.json(stories)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/favorites/query
router.post('/favorites/query', jsonParser, function (req, res) {
    favoriteService.getFavorites(req.body)
        .then(
            stories => res.json(stories),
            error => {res.status(400).send(error);});
});

//DELETE /api/v1/favorites
router.delete('/favorites/:userId/:ownerId', jsonParser, function (req, res) {
    const userId = req.params.userId;
    const ownerId = req.params.ownerId;
    favoriteService.deleteFavorite(userId, ownerId)
        .then(
            stories => res.json(stories),
            error => {res.status(400).send(error);});
});

/**
 * Donors Options
 * */
const donorService = require('../services/donor.service');


//GET /api/v1/donors/:role/:duration
router.get('/donors/:role/:duration',function (req, res) {
    const role = req.params.role;
    const duration = req.params.duration;
    donorService.getDonors(duration, role)
        .then(
            donors => res.json(donors),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/donors
//NEED AUTH
router.put('/donors', jsonParser, function (req, res) {
    donorService.updateDonors(req.body.duration, req.body.role, req.body.donors)
        .then(
            donors => {res.json(donors)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/donors/generate/:role/:duration
//NEED AUTH
router.get('/donors/generate/:role/:duration',function (req, res) {
    const role = req.params.role;
    const duration = req.params.duration;
    donorService.generateDonors(duration, role)
        .then(
            donors => res.json(donors),
            error => {res.status(400).send(error);});
});



/**
 * Story Options
 * */
const storyService = require('../services/story.service');

//POST /api/v1/stories/query
router.post('/stories/query', jsonParser, function (req, res) {
    storyService.getStories(req.body)
        .then(
            stories => res.json(stories),
            error => {res.status(400).send(error);});
});

//PUT /api/v1/stories
//NEED AUTH
router.put('/stories', jsonParser, function (req, res) {
    storyService.updateStory(req.body)
        .then(
            stories => {res.json(stories)},
            error => {res.status(400).send(error);});
});

//POST /api/v1/stories
//NEED AUTH
router.post('/stories', jsonParser, function (req, res) {
    storyService.addStory(req.body)
        .then(
            stories => {res.json(stories)},
            error => {res.status(400).send(error);});
});

//GET /api/v1/stories/:storyId
router.get('/stories/:storyId',function (req, res) {
    const storyId = req.params.storyId;
    storyService.getStory(+storyId)
        .then(
            stories => res.json(stories),
            error => {res.status(400).send(error);});
});


/**
 * Group Options
 * */
const groupService = require('../services/group.service');

// POST /api/v1/groups
router.post('/groups', jsonParser, function (req, res) {
    groupService.addGroup(req.body)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// GET /api/v1/groups/:ownerId
router.get('/groups/:ownerId', function (req, res) {
    const ownerId = req.params.ownerId;
    groupService.getGroup(ownerId)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// POST /api/v1/groups/query
router.post('/groups/query', jsonParser, function (req, res) {
    groupService.getGroups(req.body)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// PUT /api/v1/groups
router.put('/groups', jsonParser, function (req, res) {
    groupService.updateGroup(req.body)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// GET /api/v1/group-users/:ownerId
router.get('/group-users/:ownerId', function (req, res) {
    const ownerId = req.params.ownerId;
    groupService.getGroupUsers(ownerId)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// DELETE /api/v1/group-users/:ownerId/:userId
router.delete('/group-users/:ownerId/:userId', function (req, res) {
    const groupId = req.params.ownerId;
    const userId = req.params.userId;
    groupService.deleteGroupUser(userId, groupId)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

// POST /api/v1/groups-users
router.post('/group-users/', jsonParser, function (req, res) {
    groupService.addGroupUser(req.body)
        .then(
            data => res.json(data),
            error => {res.status(400).send(error);});
});

module.exports = router;