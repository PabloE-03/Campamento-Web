import { Monitor } from "@/models/monitor";
import { defineStore } from "pinia";
import { ref,computed } from "vue";

const defaultUser = new Monitor("","","");

export const defineUserStore = defineStore('usuarios',()=>{
    //state
    const usuario = ref(defaultUser);
    //getters
    const getUserEmail = computed(()=> usuario.value.email == "" ? undefined : usuario.value.email); 
    //actions
    const logUsuario = (newUser)=>usuario.value = newUser
    return {usuario,getUserEmail,logUsuario}

})