
const heroes = require('../controller/heroes.controller.js');

var router = require('express').Router();

// ?? GET Methods
    // ** GET All
    router.get('/heroes', heroes.findAll);

    // ** GET byID
    router.get('/heroe/:id', heroes.findOne); // !! estatico

    // ** GET byTerm
    router.get('/heroesTerm', heroes.findSome) // !! dinamico

    // ** GET Active
    router.get('/heroesActive', heroes.findActive);

    // ** GET Agrupacion
    router.get('/heroesGroup', heroes.grouping); // help

    // ** GET Paginación
    router.get('/heroesPag', heroes.pagination);

    // ** POST Heroe
    router.post('/heroe', heroes.create);

    // ** UPDATE Heroe
    router.put('/heroe/:id', heroes.update);

    // ** DELETE Heroe
    router.delete('/heroe/:id', heroes.delete);

module.exports = router; // ?? poder usar router