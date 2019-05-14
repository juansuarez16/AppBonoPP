const fs = require('fs');

module.exports = {
    addPlayerPage: (req, res) => {
        
        let combodocumento= "SELECT * FROM `tbltipodedocumento`";
        let combopersona="SELECT * FROM `tbltipodepersona`";
        db.query(combopersona, (err, result3) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(combodocumento, (err, result2) => {
                if (err) {
                    return res.status(500).send(err);
                }
            res.render('AñadirParticipante.ejs', {
                title: "Welcome to Socka | Add a new player"
                ,message: '',                
                tablaPersona:result3,
                tablaDocumentos:result2
            });
        });
       
                                   
              
            
        });
        
    },
    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';

          
        let Id_DatosPersonas = parseInt(req.body.tipodedocumento);
        let Id_TipodeDocumento = req.body.Id_TipodeDocumento;
        let NumerodeDocumento = req.body.NumerodeDocumento;
        let Nombre1= req.body.number;
        let Nombre2= req.body.username;
        let Apellido1=req.body.Apellido1;
        let Apellido2=req.body.Apellido2;
        let Telefono1=req.body.Telefono1;
        let Telefono2=req.body.Telefono2;
        let Celular1=req.body.Celular1;
        let Celular2=req.body.Celular2 ;
        let uploadedFile = req.files.Archivo;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = NumerodeDocumento  + '.' + fileExtension;
       
        let usernameQuery = "SELECT * FROM `tbldatospersonas` WHERE NumerodeDocumento = '" + NumerodeDocumento+ "'";

        
        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('AñadirParticipante.ejs', {
                    message,
                    title: 'prueba'
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'Archivo/png' || uploadedFile.mimetype === 'Archivo/jpeg' || uploadedFile.mimetype === 'Archivo/gif'|| uploadedFile.mimetype === 'Archivo/pdf'|| uploadedFile.mimetype === 'Archivo/docx') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assent/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `players` (Id_TipodeDocumento,NumerodeDocumento, Nombre1, Nombre2, Apellido1, Apellido2, Telefono1) VALUES ('" +
                        Id_TipodeDocumento + "', '" +NumerodeDocumento + "', '" + Nombre1 + "', '" + Nombre2 + "', '" + Apellido1 + "', '" + Apellido2 + "', '" + Telefono1 + "', '" + Telefono2 + "', '" + Celular1 + "', '" + Celular2 + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('AñadirParticipante.ejs', {
                        message,
                        title: 'prueba'
                    });
                }
            }
        });
    },
    editPlayerPage: (req, res) => {
        let playerId = req.params.id;
        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-player.ejs', {
                title: 'editar jugador'
                ,player: result[0]
                ,message: ''
            });
        });
    },
    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePlayer: (req, res) => {
        let playerId = req.params.id;
        let getImageQuery = 'SELECT image from `players` WHERE id = "' + playerId + '"';
        let deleteUserQuery = 'DELETE FROM players WHERE id = "' + playerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
