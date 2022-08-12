const { Client } = require('pg')
const config = require('./config.js')

// const config = {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'always_music',
//     password: '1234',
//     port: 5432
// }

const client = new Client(config)

client.connect(err => {
    if (err) {
        console.log(err);
    }
})

// Funciones para manejar los lugares
async function nuevoEstudiante(rut, nombre, curso, nivel) {

    const resp = await client.query(`insert into estudiantes (rut, nombre, curso, nivel) values ('${rut}', '${nombre}', '${curso}', ${nivel}) returning *`)

    console.log(resp);
    client.end()
}
//nuevoEstudiante('18.123.902-6', 'camilo', 'Acordes basicos', '7')

//
async function mostrarEstudiantes() {
    const respuesta = await client.query('select * from estudiantes')
    console.log(respuesta.rows);
    client.end()
}
//mostrarEstudiantes();

async function mostrarEstudiante(rut) {
    const respuesta = await client.query(`select * from estudiantes where rut = '${rut}'`)
    console.log(respuesta.rows);
    client.end()
}
//mostrarEstudiante('18.123.902-6');

async function actualizarEstudiante(rut, nombre, curso, nivel) {
    const respuesta = await client.query(`update estudiantes set nombre ='${nombre}',  curso ='${curso}',  nivel =${nivel} where rut ='${rut}' returning *`)
    //console.log(respuesta.rows);
    console.log(`Estudiante ${nombre} agregado con éxito`)
    client.end()
}
//actualizarEstudiante('18.123.902-6','camilo','acorde intermedio',2);

async function eliminarEstudiante(rut) {
    const respuesta = await client.query(`delete from estudiantes where rut ='${rut}' returning *`)
    console.log(respuesta.rows);
    client.end()
}
//eliminarEstudiante('18.123.902-6');

// Acciones

const accion = process.argv[2]
//node comand.js accion rut nombre curso nivel
if (accion == 'nuevo' && !!rut && !!nombre && !!curso && !!nivel  ) {
    const rut =  process.argv[4]
    const nombre =  process.argv[3]
    const curso =  process.argv[5]
    const nivel =  process.argv[6]

    nuevoEstudiante(rut, nombre, curso, nivel)
}
else if (accion == 'consulta') {
 //node comand.js accion
    mostrarEstudiantes()
}
else if (accion == 'rut') {
//node comand.js accion rut 
    const rut = process.argv[3]
    mostrarEstudiante(rut)
}
else if (accion == 'editar') {
//node comand.js accion rut nombre curso nivel
const rut =  process.argv[4]
const nombre =  process.argv[3]
const curso =  process.argv[5]
const nivel =  process.argv[6]
actualizarEstudiante(rut,nombre,curso,nivel)
}
else if (accion == 'eliminar'){
    //node comand.js accion rut
    const rut =  process.argv[3]
    eliminarEstudiante(rut)
}
else {
    console.log(`Acción ${accion} no implementada`);
}