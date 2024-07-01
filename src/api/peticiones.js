
const basePath = "http://localhost:8080";

export const loginRequest = async (email,passwd) =>{
    try
    {
        let url = basePath+"/campamento/login";

        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "email":email,
                "passwd":passwd
            }
        });

        if(!response.ok)
        {
            throw new Error("El usuario o contraseña son erroneos "+response.statusText);
        }   

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const getSesion = async () =>{
    try
    {
        let url = basePath+"/campamento/login";

        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            }
        });

        if(!response.ok)
        {
            throw new Error("No hay informacion de la sesion "+response.statusText);
        }   

        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const getAllObjectRequest = async (url) =>{
    try
    {
        let finalUrl = basePath+url;

        const response = await fetch(finalUrl,{
            headers:{
                "Content-Type":"application/json"
            }
        });

        if(!response.ok)
        {
            throw new Error("Error al obtener el objeto determinado "+response.statusText)
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const asignadosPorMonitor = async(monitor)=>{
    try
    {
        let url = basePath+"/campamento/get/assigned";

        const response = await fetch(url,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "monitor":monitor,
            }
        })

        if(!response.ok)
        {
            throw new Error("El monitor seleccionado no existe");
        }

        return await response.json();
    }
    catch(error)
    {
        console.log(error);
    }
}

export const asignar = async (monitor,nombre,apellido) => {
    try
    {
        let url = basePath+"/campamento/asignar/children";

        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "monitor":monitor,
                "childrenName":nombre,
                "childrenSurname":apellido
            }
        })

        if(!response.ok)
        {
            throw new Error("Error al asignar un niño a un monitor");    
        }

        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const desAsignar = async (monitor,nombre,apellido) =>{
    try
    {
        let url = basePath+"/campamento/quitar-asignacion/children";

        const response = await fetch(url,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "monitor":monitor,
                "childrenName":nombre,
                "childrenSurname":apellido
            }
        })

        if(!response.ok)
        {
            throw new Error("Error aL desasignar un niño a un monitor");   
        }

        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const postChildren = async (children) =>{
    try
    {
        let url = basePath+"/campamento/insert/child";
        
        const response = await fetch(url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(children)
        })

        if(!response.ok)
        {
            throw new Error("Objeto mal formado")   
        }

        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const changePassword = async (email,passwd,newPasswd) =>{
    try
    {
        let url = basePath+"/campamento/change/password";

        const response = await fetch(url,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "email":email,
                "password":passwd,
                "newPassword":newPasswd    
            }
        })

        if(!response.ok)
        {
            throw new Error("Monitor o contraseña incorrectas");   
        }

        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}

export const changeRol = async (nombre,rol) => {
    try
    {
        let url = basePath+"/campamento/change/rol";

        const response = await fetch(url,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "name":nombre,
                "newRol":rol,    
            }
        })

        if(!response.ok)
        {
            throw new Error("Monitor incorrecto");   
        }
    
        return true;
    }
    catch(error)
    {
        console.log(error);
        return false;
    }
}