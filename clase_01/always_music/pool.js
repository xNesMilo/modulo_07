const { Pool } = require('pg')
const config = require('./config.js')


const pool = new Pool(config)

// Funciones para manejar los lugares
async function nuevoEstudiante(rut, nombre, curso, nivel) {
    const client = await pool.connect()
    const resp = await client.query(`insert into estudiantes (rut, nombre, curso, nivel) values ('${rut}', '${nombre}', '${curso}', ${nivel}) returning *`)

    client.release()
    pool.end()
}
//nuevoEstudiante('18.123.902-6', 'camilo', 'Acordes basicos', '7')

//
async function mostrarEstudiantes() {
    const client = await pool.connect()
    const respuesta = await client.query('select * from estudiantes')
    console.log(respuesta.rows);
    
    client.release()
    pool.end()
}
//mostrarEstudiantes();

async function mostrarEstudiante(rut) {
    const client = await pool.connect()
    const respuesta = await client.query(`select * from estudiantes where rut = '${rut}'`)
    if(respuesta.rows == '' ){
        console.log('Rut no valido');
    }else {
        console.log(`Mostrando usuario ${respuesta.rows[0].nombre} con Rut ${respuesta.rows[0].rut} Esta cursando ${respuesta.rows[0].curso}`);
    }
    
    client.release()
    pool.end()
}
//mostrarEstudiante('18.123.902-6');

async function editarEstudiante(rut, nombre, curso, nivel) {
    const client = await pool.connect()
    const respuesta = await client.query(`update estudiantes set nombre ='${nombre}',  curso ='${curso}',  nivel =${nivel} where rut ='${rut}' returning *`)
    //console.log(respuesta.rows);
    console.log(`Estudiante ${nombre} agregado con éxito`)
    
    client.release()
    pool.end()
}
//actualizarEstudiante('18.123.902-6','camilo','acorde intermedio',2);

async function eliminarEstudiante(rut) {
    const client = await pool.connect()
    const respuesta = await client.query(`delete from estudiantes where rut ='${rut}' returning *`)
    if(respuesta.rows == ''){
        console.log('Rut invalido');
    } else {
        console.log(respuesta.rows);
    }

    client.release()
    pool.end()
}
//eliminarEstudiante('18.123.902-6');

// Acciones

const accion = process.argv[2]
//node comand.js accion rut nombre curso nivel
if (accion == 'nuevo') {
    const rut =  process.argv[4]
    const nombre =  process.argv[3]
    const curso =  process.argv[5]
    const nivel =  process.argv[6]

    if(!!nombre && !!rut && !!curso && !!nivel){
        nuevoEstudiante(nombre, rut, curso, nivel)
        console.log('Usuario creado correctamente');
    } else {
        console.log('Faltan datos para crear al usuario');
    }
}
else if (accion == 'consulta' && process.argv.length == 3) {
 //node comand.js accion
    mostrarEstudiantes()
    console.log('Mostrando todos los estudiantes');
}
else if (accion == 'rut') {
//node comand.js accion rut 
    const rut = process.argv[3]
    if(rut.length === 12) {
        mostrarEstudiante(rut)
    } else {
        console.log('Rut no valido');
    }
}
else if (accion == 'editar') {
//node comand.js accion rut nombre curso nivel
const rut =  process.argv[4]
const nombre =  process.argv[3]
const curso =  process.argv[5]
const nivel =  process.argv[6]
if(process.argv.length == 7){
    editarEstudiante(rut,nombre,curso,nivel)
}else {
    console.log('Faltan argumentos');
}
}
else if (accion == 'eliminar'){
    //node comand.js accion rut
    const rut =  process.argv[3]
    if(rut.length == 12){
        eliminarEstudiante(rut)
    }else {
        console.log('Rut invalido');
    }
}
else {
    console.log(`Acción ${accion} no implementada`);
}