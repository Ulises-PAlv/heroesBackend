/** CONTROLLER */

const db = require('../model/heroes.model.js');
const Heroe = db.heroes;

// ?? CREATE Operation 
exports.create = (req,res) => {
    if(!req.body){
        req.status(400).send({ message : "El contenido de la petición no puede estar vacío"});
        return;
    }

    Heroe.findOne().sort({ _id: -1}).then(data => {
        var aux = parseInt(data._id) + 1;
        
        // Crear heroe
        const heroe = new Heroe({
            _id: aux,
            nombre: req.body.nombre,
            bio: req.body.bio,
            img: req.body.img,
            aparicion: req.body.aparicion,
            casa: req.body.casa,
            activo: true
        });
        
        heroe.save().then(data => {
            res.send(data);
        }).catch(err => {
            throwError(res,err);
        });
    });
};

// ?? READ Operation
exports.findAll = (req, res) => {
    Heroe.find().then(data => {
        res.send(data);
    }).catch(err => {
        throwError(res, err);
    })
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Heroe.findById(id).then(data => {
        if(!data) {
            res.status(404).send({ message: `No se encontro elemento con id: ${id}` });
        } else {
            res.send(data);
        }
    }).catch(err => {
        throwError(res, err);
    });
};

exports.findSome = (req, res) => {
    const termino = req.query.termino;
    var query = termino ? { nombre: { $regex: new RegExp(termino), $options: 'i' }, activo: true } : {};
    
    Heroe.find(query).then(data => {
        res.send(data);
    }).catch( err => {
        throwErrorres(res, err);
    });
};

exports.findActive = (req, res) => {
    Heroe.find({ activo: true }).then(data => {
        res.send(data);
    }).catch( err => {
        throwErrorres(res, err);
    });
};

// ?? UPDATE Operation
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: 'La petición no puede ser vacia'
        });
    }

    const id = req.params.id;

    Heroe.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if(!data) {
            res.status(404).send({
                message: `No se pudo actualizar Heroe con id ${id}`
            });
        } else {
            res.send({
                message: 'Heroe actualizado correctamente'
            });
        }
    }).catch(err => {
        throwError(res, err);
    })
};

// ?? DELETE Operation
exports.delete = (req, res) => {
    const id = req.params.id;

    Heroe.findByIdAndUpdate(id, { activo: false }, { useFindAndModify: false }).then(data => {
        if(!data) {
            res.status(404).send({
                message: `No se pudo actualizar el heroe con el id ${id}` 
            });
        } else {
            res.send({
                message: 'Heroe removido correctamente'
            });
        }
    }).catch(err => {
        throwError(res, err);
    });
};

// ?? AGGREGATE 
// !! HELPPPPP
exports.grouping = (req, res) => {
    Heroe.aggregate([
        { $lookup:  {
            from: Casas,
            localField: casa,
            foreignField: casa,
            as: casas
        }},
        { $unwind: $casas},
        /*{ $project: {
            _id: 0,
            nombre: 1,
            casa: 1
        }}*/
    ]).then(grupo => {
        res.send(grupo);
    }).catch(err => {
        throwError(res,err);
    });
};

// ?? PAGINACIÓN
exports.pagination = async(req, res) => {
    const { page = 1, limit = 3} = req.query;

    try {
        // Ejecutar query con numero de pagina y limite de documento
        const heroes = await Heroe.find().limit(limit * 1).skip((page - 1) * limit).exec();

        // Obtener el total de documentos en la coleccion
        const total =  await Heroe.countDocuments();

        // Enviar respuesta
        res.json({
            heroes,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    }catch(err) {
        throwError(res, err);
    }
};

// ## UTILS ###
function throwError(res, err) {
    res.status(500).send(
        { 
            mesagge: err.message || 'Ocurrió un error en el web server :(' 
        }
    );
}

