<script setup>
import { useRouter } from 'vue-router';
import { onMounted,ref, watch} from 'vue';
import {loginRequest} from "@/api/peticiones";
import { defineUserStore } from '@/stores/usuarios';
import { Monitor } from '@/models/monitor';

const router = useRouter();
const infoSesion = ref("");
const recarga = ref(true);
const passByScreen = ref(false);
const usuario = defineUserStore();


const iniciarSesion = async()=>{
    const emailInput = document.getElementById("email");
    const passwd = document.getElementById("passwd");
    const data = await loginRequest(emailInput.value,passwd.value);
    infoSesion.value = "";
    if(typeof data!="undefined")
    {
        let newUser = new Monitor(data.email,data.nombre,data.rol);
        usuario.logUsuario(newUser);
        router.push("/listas");
    }
    else
    {
        infoSesion.value = "El usuario o contraseña son erroneos";
    }
    recarga.value = true;
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
    if(typeof usuario.getUserEmail != "undefined")
    {
        router.push("/listas");   
    }
});
</script>
<template>
    <div v-if="passByScreen" v-show="recarga">
        <h1 class="texto-sesion">Inicio de sesion</h1>
        <div class="cuadro-sesion">
            <h2 class="input-text">Email:<input id="email" type="email"></h2>
            <h2 class="input-text">Contraseña:<input id="passwd" type="password"></h2>
            <button id="submit" v-on:click="iniciarSesion">Iniciar sesion</button>
            <h2 class="info-sesion">{{infoSesion}}</h2>       
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
