# Requisitos  
1. NodeJs
2. json-server ejecutándose en el puerto 3000  
  
# Instalacion  

1. Instale json-server de forma global    

`npm install -g json-server`  

2. Ejecute json-server desde el directorio raíz del proyecto com el comando en un console:   

`json-server --watch db.json`   

Si no se ejecuta en el puerto 3000, inicie el servidor con el siguiente comando:   

`json-server --watch db.json --port 3000`    

  
3. Para confirmar que todo salió como se esperaba, el servidor debe cargarse como 'Resources', la ruta "http://localhost:3000/tarjetas"  
  
    
4. Si todo salió bien, abra el navegador y vaya a "http://localhost:3000/"     
