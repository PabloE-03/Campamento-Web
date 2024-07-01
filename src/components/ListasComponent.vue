<script setup>
import { useRouter } from 'vue-router';
import { loginRequest } from "@/api/peticiones"
import { ref,onMounted } from 'vue';
const router = useRouter();
const passByScreen = ref(false)

let infoSesion = ref("");


const iniciarSesion = async()=>{
    const emailInput = document.getElementById("email");
    const passwd = document.getElementById("passwd");
    const data = await loginRequest(emailInput.value,passwd.value);
    infoSesion.value = "";
    if(typeof data!="undefined" || data)
    {
        router.push({path:"/listas",params:{rol:"dato a transportar"}})
    }
    else
    {
        infoSesion.value = "El usuario o contraseña son erroneos";
    }
}

onMounted(()=>{
    let screenX = screen.width;
    passByScreen.value = screenX<=500 ? true : false;
})
</script>
<template>
    <main>
        <div v-if="passByScreen">
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
    </main>
    
</template>
<style scoped>
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
