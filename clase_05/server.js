const express = require ('express');
const { ClientRequest } = require('http');
const { connect } = require('http2');
const app = express();
const { Pool } = require('pg');
const { pathToFileURL } = require('url');
const config = require('./config.js');
const { getForm } = require('./getform.js')
const pool = new Pool (config);
//Conexion al servidor con prueba de error.
pool.connect (err => {
    if (err){
        console.log(err);
    }
})

app.use(express.static('public'));

app.post('/cancion', async (req, res)=>{
//Recibe los datos correspondientes a una cancion e inserta los datos en la tabla SQL
    const datos = await getForm(req)
    const cancion = datos.cancion
    const artista = datos.artista
    const tono = datos.tono
    const client = await pool.connect()
    const agregarCancion = await client.query(`insert into repertorio (cancion, artista, tono) values ('${cancion}', '${artista}', '${tono}') returning *;`)
    
    client.release()
    res.end()
});

app.get('/canciones', async (req, res)=>{
//Devuelve un JSON con los registros de la tabla 
    const client = await pool.connect()
    const llamarCanciones = await client.query('select * from repertorio;')
    const canciones = await llamarCanciones.rows;
    res.json(canciones)
});

app.put('/cancion', async (req, res)=>{
//Toma un valor a editar y lo edita en la tabla SQL
    const datos = await getForm(req)
    const id = datos.id
    const cancion = datos.cancion
    const artista = datos.artista
    const tono = datos.tono
    const client = await pool.connect()
    const editarCancion = await client.query(`update repertorio set cancion='${cancion}', artista='${artista}', tono='${tono}' where id=${id} returning *; `)
    client.release()
    res.end()
});

app.delete('/cancion', async (req, res)=>{
//Recibe un QueryString y consulta en la base SQL y lo elimina. 
    const id = req.query.id
    const client = await pool.connect()
    const eliminarCancion = await client.query(`delete from repertorio where id=${id} returning *`); 
    client.release();
    res.end();  
    console.log('Eliminado');
});

//Puerto
app.listen(3000, function(){
    console.log('Server ON');
})