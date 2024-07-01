<script setup>
import { useRouter } from 'vue-router';
import { onMounted,ref, watch} from 'vue';
import {getAllObjectRequest,asignar,desAsignar,asignadosPorMonitor,postChildren,changePassword,changeRol,loginRequest} from "@/api/peticiones";
import { Children } from '@/models/childrens';
import { Monitor } from '@/models/monitor';
const router = useRouter();
const passByScreen = ref(false);
const showChildren = ref(false);
const showSickChildren = ref(false);
const showAllChildrens = ref(false);
const login = ref(false);

let usuario = new Monitor("","","","");

let infoSesion = ref("");
let administrador = ref(false);
let moderador = ref(false);
let vetado = ref(false);
let recarga = ref(true);
let interval = undefined;
let secondInterval = undefined;

let childrens = ref([]);
let _childrens = ref([]);

let notAssigned = ref([]);
let asignInfo = ref("");
let asignStyle = ref("");
let showAsignInfo = ref(false);

let assigned = ref([]);
let desAsignInfo = ref("");
let desAsignStyle = ref("");
let showDesAsignInfo = ref(false);

let infoChildren = ref("");
let styleChildren = ref("");
let showInfoChildren = ref(false);

let infoPassword = ref("");
let stylePassword = ref("");
let showPassword = ref(false);

let infoRol = ref("");
let styleRol = ref("");
let showRol = ref(false);

let monitores = ref([]);
let childrenMonitores = ref([]);
let childrenMonitoresSick = ref([]);

const getAllChildrens = async()=>{
    const rawChildrens = await getAllObjectRequest("/campamento/get-all/childrens");
    let arrayObjeto = [];
    let array = [];
    for(let i = 0;i<rawChildrens.length;i++)
    {
        let children = new Children(rawChildrens[i].numeroSS,rawChildrens[i].nombre,rawChildrens[i].apellido,rawChildrens[i].enfermedades);
        let valorChildren = rawChildrens[i].nombre + " " + rawChildrens[i].apellido;
        arrayObjeto.push(children);
        array.push(valorChildren);
    }

    childrens = ref(array);
    _childrens = ref(arrayObjeto);
}

const getAllMonitores = async()=>{
    const rawMonitor = await getAllObjectRequest("/campamento/get-all/monitores");
    let arrayObjeto = [];
    let array = [];
    for(let i = 0;i<rawMonitor.length;i++)
    {
        let monitor = new Monitor(rawMonitor[i].email,rawMonitor[i].nombre,rawMonitor[i].rol);
        let valorMonitor = rawMonitor[i].nombre;
        arrayObjeto.push(monitor);
        array.push(valorMonitor);
    }

    monitores = ref(array);
    _monitores = ref(arrayObjeto);
}

const getNotAssignedChild = async()=>{
    const rawChildrens = await getAllObjectRequest("/campamento/get/not-assigned");
    let array = [];
    for(let i = 0;i<rawChildrens.length;i++)
    {
        let valorChildren = rawChildrens[i].nombre + " " + rawChildrens[i].apellido;
        array.push(valorChildren);
    }

    notAssigned = ref(array);
}

const getAssignedChildByMonitor = async()=>{
    const rawMonitores = document.getElementById("monitores-2");
    const rawChildrens = await asignadosPorMonitor(rawMonitores.value);
    let array = [];
    for(let i = 0;i<rawChildrens.length;i++)
    {
        let valorChildren = rawChildrens[i].nombre + " " + rawChildrens[i].apellido;
        array.push(valorChildren);
    }
    assigned = ref(array);
    recarga.value = false;
}

const asignarChildren = async()=>{
    const rawMonitor = document.getElementById("monitores");
    const rawChildren = document.getElementById("childrens");
    let monitor = rawMonitor.value;
    let valueChildren = rawChildren.value;
    let children = new Children("","");
    for(let i = 0;i<_childrens.value.length;i++)
    {
        let item = _childrens.value[i];
        let value = item.nombre+" "+item.apellido;
        if(value==valueChildren)
        {
            children = item;
            break;
        }
    }

    const data = await asignar(monitor,children.nombre,children.apellido);

    if(data)
    {
        asignInfo.value = "Niño asignado correctamente";
        asignStyle.value = "color:forestgreen; font-weight:bolder;";
        showAsignInfo.value = true;
    }
    else
    {
        asignInfo.value = "Error al asignar al niño";
        asignStyle.value = "color:darkred; font-weight:bolder;";
        showAsignInfo.value = true;
    }
    rawChildren.selectedIndex = 0;
    getNotAssignedChild();
    recarga.value = false;
    interval = setInterval(hideAsignInfo,5000);
    const rawChildrens = await asignadosPorMonitor(rawMonitor.value);
        let array = [];
        let arraySick = [];
        for(let i = 0;i<rawChildrens.length;i++)
        {
            let item = rawChildrens[i];
            array.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
            for(let k = 0;k<item.enfermedades.length;k++)
            {
                if(item.enfermedades[i]!="Ninguna")
                {
                    arraySick.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
                }
            }
        }
        childrenMonitores = ref(array);
        childrenMonitoresSick = ref(arraySick);
        recarga.value = false;

}

const desasignarChildren = async()=>{
    const rawMonitor = document.getElementById("monitores-2");
    const rawChildren = document.getElementById("childrens-2");
    let monitor = rawMonitor.value;
    let valueChildren = rawChildren.value;
    let children = new Children("","");
    for(let i = 0;i<_childrens.value.length;i++)
    {
        let item = _childrens.value[i];
        let value = item.nombre+" "+item.apellido;
        if(value==valueChildren)
        {
            children = item;
            break;
        }
    }

    const data = await desAsignar(monitor,children.nombre,children.apellido);

    if(data)
    {
        desAsignInfo.value = "Niño desasignado correctamente";
        desAsignStyle.value = "color:forestgreen; font-weight:bolder;";
        showDesAsignInfo.value = true;
    }
    else
    {
        desAsignInfo.value = "Error al desasignar al niño";
        desAsignStyle.value = "color:darkred; font-weight:bolder;";
        showDesAsignInfo.value = true;
    }
    rawChildren.selectedIndex = 0;
    getNotAssignedChild();
    recarga.value = false;
    interval = setInterval(hideDesAsignInfo,5000);
    getAssignedChildByMonitor();
    const rawChildrens = await asignadosPorMonitor(rawMonitor.value);
        let array = [];
        let arraySick = [];
        for(let i = 0;i<rawChildrens.length;i++)
        {
            let item = rawChildrens[i];
            array.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
            for(let k = 0;k<item.enfermedades.length;k++)
            {
                if(item.enfermedades[i]!="Ninguna")
                {
                    arraySick.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
                }
            }
        }
        childrenMonitores = ref(array);
        childrenMonitoresSick = ref(arraySick);
        recarga.value = false;
}

const insertChildren = async () =>{
    const rawNumeroSS = document.getElementById("numeross-niño");
    const rawNombre = document.getElementById("nombre-niño");
    const rawApellido = document.getElementById("apellido-niño");
    const rawEnfermedades = document.getElementById("enfermedad-niño");

    let enfermedades = rawEnfermedades.value.split(",");
    let insertar = true;
    if(rawNumeroSS.value.trim() == "" || rawNombre.value.trim() == "" || rawApellido.value.trim() == "")
    {
        infoChildren.value = "Hay campos vacíos";
        styleChildren.value = "color: darkred; font-weight: bolder;";
        showInfoChildren.value = true;
        insertar = false
    }
    else
    {
        for(let i = 0;i<enfermedades.length;i++)
        {
            if(enfermedades[i].charAt(0)==" ")
            {
                insertar = false;
            }
        }
    }

    if(!insertar && infoChildren.value=="")
    {
        infoChildren.value = "El campo enfermedad está mal formado";
        styleChildren.value = "color: darkred; font-weight: bolder;";
        showInfoChildren.value = true;
    }
    else if(insertar)
    {
        let children = new Children(rawNumeroSS.value,rawNombre.value,rawApellido.value,enfermedades);
        const data = await postChildren(children);

        if(data)
        {
            infoChildren.value = "Niño insertado";
            styleChildren.value = "color: forestgreen; font-weight: bolder;";
            showInfoChildren.value = true;
        }
        else
        {
            infoChildren.value = "No se ha podido insertar al niño";
            styleChildren.value = "color: darkred; font-weight: bolder;";
            showInfoChildren.value = true;
            insertar = false;
        }
    }

    secondInterval = setInterval(hideChildrenInfo,7000);
    if(insertar)
    {
        rawNumeroSS.value = "";
        rawNombre.value = "";
        rawApellido.value = "";
        rawEnfermedades.value = "";
    }
    
    recarga.value = false;
}

const patchPassword = async ()=>{
    const email = document.getElementById("email-monitor")
    const oldPassword = document.getElementById("old-password");
    const newPassword = document.getElementById("new-password");

    const data = await changePassword(email.value,oldPassword.value,newPassword.value);

    if(data)
    {
        infoPassword.value = "Contraseña cambiada";
        stylePassword.value = "color:forestgreen; font-weight:bolder;";
        showPassword.value = true;
    }
    else
    {
        infoPassword.value = "Error al cambiar la contraseña";
        stylePassword.value = "color:darkred; font-weight:bolder;";
        showPassword.value = true;
    }
    interval = setInterval(hideInfoPassword,5000);
    recarga.value = false;

}

const patchRol = async()=>{
    const rawMonitor = document.getElementById("monitores-3");
    const rawRol = document.getElementById("rol-monitor");

    const data = await changeRol(rawMonitor.value,rawRol.value);

    if(data)
    {
        infoRol.value = "Rol cambiado";
        styleRol.value = "color:forestgreen; font-weight:bolder;";
        showRol.value = true;
        rawMonitor.selectedIndex = 0;
    }
    else
    {
        infoRol.value = "Error al cambiar el rol";
        styleRol.value = "color:darkred; font-weight:bolder;";
        showRol.value = true;
    }

    secondInterval = setInterval(hideInfoRol,5000)
}

const iniciarSesion = async()=>{
    const emailInput = document.getElementById("email");
    const passwd = document.getElementById("passwd");
    const data = await loginRequest(emailInput.value,passwd.value);
    infoSesion.value = "";
    if(typeof data!="undefined")
    {
        if(data.rol=="Administrador")
        {
            administrador.value = true;
        }
        else if(data.rol=="Moderador")
        {
            moderador.value = true;
        }
        else if(data.rol=="Vetado")
        {
            vetado.value = true;
        }
        usuario.email = data.email;
        usuario.nombre = data.nombre;
        usuario.rol = data.rol;
        login.value = true;

        const rawChildrens = await asignadosPorMonitor(usuario.nombre);
        let array = [];
        let arraySick = [];
        for(let i = 0;i<rawChildrens.length;i++)
        {
            let item = rawChildrens[i];
            array.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
            for(let k = 0;k<item.enfermedades.length;k++)
            {
                if(item.enfermedades[i]!="Ninguna")
                {
                    arraySick.push(new Children(item.numeroSS,item.nombre,item.apellido,item.enfermedades));
                }
            }
        }
        childrenMonitores = ref(array);
        childrenMonitoresSick = ref(arraySick);
        recarga.value = false;
    
    }
    else
    {
        infoSesion.value = "El usuario o contraseña son erroneos";
    }
    recarga.value = true;
}

const setRecarga = ()=>{
    recarga.value = false;
    clearInterval(interval);
}

const hideAsignInfo = ()=>{
    showAsignInfo.value = false;
    clearInterval(interval);
}

const hideDesAsignInfo = ()=>{
    showDesAsignInfo.value = false;
    clearInterval(interval);
}

const hideChildrenInfo = ()=>{
    showInfoChildren.value = false;
    clearInterval(secondInterval);
}

const hideInfoPassword = ()=>{
    showPassword.value = false;
    clearInterval(secondInterval);
}

const hideInfoRol = () =>{
    showRol.value = false;
    clearInterval(secondInterval);
}

watch(recarga,(nuevo,viejo)=>{
    if(!nuevo)
    {
        recarga.value = true;
    }
})

onMounted(()=>{
    let screenX = screen.width;
    passByScreen.value = screenX<=600 ? true : false;
    getAllChildrens();
    getAllMonitores();
    getNotAssignedChild();
    interval = setInterval(setRecarga,100);
    
})
</script>
<template>
    <div v-if="passByScreen" v-show="recarga">
        <div v-show="!login">
            <h1 class="texto-sesion">Inicio de sesion</h1>
            <div class="cuadro-sesion">
                <h2 class="input-text">Email:<input id="email" type="email"></h2>
                <h2 class="input-text">Contraseña:<input id="passwd" type="password"></h2>
                <button id="submit" v-on:click="iniciarSesion">Iniciar sesion</button>
                <h2 class="info-sesion">{{infoSesion}}</h2>
            </div>
        </div>
        <div v-show="login">
            <h1 class="cabecera-texto">Bienvenido/a {{ usuario.nombre }} </h1>
            <div class="children-monitor">
                <h2 class="cabecera-container">Tus niños</h2>
                <button class="button-container" v-if="!showChildren" v-on:click="showChildren=true">Mostrar</button>
                <button class="button-container" v-else v-on:click="showChildren=false">Ocultar</button>
                <ul v-show="showChildren">
                    <li v-for="i in childrenMonitores">{{ i.nombre+" "+i.apellido }}</li>
                </ul>
            </div>
            <div class="children-monitor">
                <h2 class="cabecera-container">Tus niños enfermos</h2>
                <button class="button-container" v-if="!showSickChildren" v-on:click="showSickChildren=true">Mostrar</button>
                <button class="button-container" v-else v-on:click="showSickChildren=false">Ocultar</button>
                <ul v-show="showSickChildren">
                    <li v-for="i in childrenMonitoresSick">{{ i.nombre+" "+i.apellido+" - "+i.enfermedades}}</li>
                </ul>
            </div>
            <div class="children-monitor">
                <h2 class="cabecera-container">Todos los niños</h2>
                <button class="button-container" v-if="!showAllChildrens" v-on:click="showAllChildrens=true">Mostrar</button>
                <button class="button-container" v-else v-on:click="showAllChildrens=false">Ocultar</button>
                <ul v-show="showAllChildrens">
                    <li v-for="i in childrens">{{ i }}</li>
                
                </ul>
            </div>
            <!-- Desactivado temporalmente  -->
            <!-- <div class="children-monitor">
                <h2 class="cabecera-container">Buscador de niños</h2>
                <h2 style="font-weight: bolder; margin: 5% 0%;">Nombre:<input type="text"></h2>
                <button class="button-container">Buscar</button>
            </div> -->
            <div class="children-monitor" v-show="administrador || moderador">
                <h2 class="cabecera-container">Administración</h2>
                <h3 style="font-weight: bolder;">Asignar niños</h3>
                <div class="seleccion-niños" v-show="administrador || moderador">
                    <h3>Monitores:</h3>
                    <select id="monitores">
                        <option selected>Seleccionar</option>
                        <option v-for="i in monitores">{{ i }}</option>
                    </select>
                    <h3>Niños:</h3>
                    <select id="childrens">
                        <option selected>Seleccionar</option>
                        <option v-for="i in notAssigned">{{ i }}</option>
                    </select>
                    <button class="button-container" v-on:click="asignarChildren">Asignar</button>
                    <h2 v-bind:style="asignStyle" v-show="showAsignInfo">{{ asignInfo }}</h2>
                </div>
                <h3 style="font-weight: bolder;">Desasignar niños</h3>
                <div class="seleccion-niños" v-show="administrador || moderador">
                    <h3>Monitores:</h3>
                    <select id="monitores-2" v-on:change="getAssignedChildByMonitor">
                        <option selected>Seleccionar</option>
                        <option v-for="i in monitores">{{ i }}</option>
                    </select>
                    <h3>Niños:</h3>
                    <select id="childrens-2">
                        <option selected>Seleccionar</option>
                        <option v-for="i in assigned">{{ i }}</option>
                    </select>
                    <button class="button-container" v-on:click="desasignarChildren">Quitar</button>
                    <h2 v-bind:style="desAsignStyle" v-show="showDesAsignInfo">{{ desAsignInfo }}</h2>
                </div>
                <div class="agregar-niños" v-show="administrador || moderador">
                    <h3 style="font-weight: bolder; margin-bottom: 3%;">Agregar niños</h3>
                    <h3>Numero SS:<input type="text" id="numeross-niño"></h3>
                    <h3>Nombre:<input type="text" id="nombre-niño"></h3>
                    <h3>Apellido:<input type="text" id="apellido-niño"></h3>
                    <h3>Enfermedad:<input type="text" id="enfermedad-niño"></h3>
                    <button class="button-container" v-on:click="insertChildren">Agregar</button>
                    <h3 v-bind:style="styleChildren" v-show="showInfoChildren">{{ infoChildren }}</h3>
                </div>
                <div class="ajustes-monitor" v-show="administrador">
                    <h3 style="font-weight: bolder; margin-top: 5%;">Cambio de contraseña</h3>
                    <h3>Email: <input type="email" id="email-monitor"></h3>
                    <h3>Old Passwd: <input type="password" id="old-password"></h3>
                    <h3>New Passwd: <input type="password" id="new-password"></h3>
                    <button class="button-container" v-on:click="patchPassword">Cambiar</button>
                    <h3 v-bind:style="stylePassword" v-show="showPassword">{{ infoPassword }}</h3>
                </div>
                <div class="ajustes-monitor" v-show="administrador">
                    <h3 style="font-weight: bolder; margin-top: 5%;">Cambio de roles</h3>
                    <h3>Monitor:</h3>
                    <select style="margin: 2% auto;" id="monitores-3">
                        <option selected>Seleccionar</option>
                        <option v-for="i in monitores">{{ i }}</option>
                    </select>
                    <h3>Rol:</h3>
                    <select id="rol-monitor" style="margin: 5% auto;">
                        <option selected>Seleccionar</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Moderador">Moderador</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Vetado">Vetado</option>
                    </select>
                    <button class="button-container" v-on:click="patchRol">Cambiar</button>
                    <h3 v-bind:style="styleRol" v-show="showRol">{{ infoRol }}</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="screen-pc" v-else>
        <h1 class="texto-ordenador">Esta aplicación solo se puede usar en dispositivos móviles, lamentamos las molestias</h1>
    </div>
</template>
<style scoped>
.texto-ordenador{
    width: 80%;
    margin: 10%;
    font-size: 3vw;
}

.cabecera-texto{
    margin-top: 5%;
    margin-left: 28%;
    font-size: 2em;
    font-weight: bolder;
}

.children-monitor{
    width: 80%;
    margin: 5% 10%;
    margin-bottom: 10%;
    height: max-content;
    background-color: white;
    border: 5px;
    border-color: lightseagreen;
    border-radius: 10px;
    border-style: solid;
    text-align: center;
}

.cabecera-container{
    font-size: 2em;
    margin-bottom: 5%;
    font-weight: bolder;
    width: fit-content;
    display: inline;
}

.button-container{
    margin-left: 5%;
    margin-bottom: 5%;
    height: 30px;
    background-color: bisque;
    border-radius: 5px;
}

.children-monitor li{
    font-size: 1.5em;
    margin-bottom: 10%;
}

.seleccion-niños h3,select{
    display: block;
}

.seleccion-niños select{
    margin: 2% auto;
}

.seleccion-niños .button-container{
    margin: 2% auto;
    width: 35%;
}

.ajustes-monitor input{
    margin: 5% 0%;
}

.agregar-niños input{
    margin: 3% 0%;
}

.seleccion-niños,.agregar-niños,.ajustes-monitor{
    width: 90%;
    border: 0px;
    border-bottom: 2px;
    border-style: solid;
    border-color: darkcyan;
    margin: 5% auto;
}

.texto-sesion{
    margin-top: 10%;
    margin-left: 28%;
    font-size: 2em;
    font-weight: bolder;
}

.screen-pc{
    text-align: center;
}

.cuadro-sesion{
    width: 80%;
    margin: 5% 10%;
    height: 320px;
    background-color: white;
    border: 5px;
    border-color: lightseagreen;
    border-radius: 10px;
    border-style: solid;
    text-align: center;
}

.input-text{
    font-size: 1.5em;
    margin-top: 13%;
}

#email,#passwd{
    width: 50%;
    height: 40px;
    border: 2px;
    border-radius: 10px;
    border-color: black;
    border-style: inset;
    font-size: 0.8em;
}

#submit{
    width:40%;
    height: 40px;
    margin-top: 10%;
    background-color: bisque;
    border: 2px;
    border-color: lightseagreen;
    border-radius: 10px;
    border-style: solid;
}

.texto-ordenador{
    width: 80%;
    margin: 10%;
    font-size: 3vw;
}

.info-sesion{
    color: darkred;
    font-weight: bolder;
    font-size: 1em;
    margin-top: 2%;
}
</style>
