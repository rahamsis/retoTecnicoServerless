## INSTALACION
```
- npm install -g serverless@latest
- serverless config credentials --provider aws --key write-the-public-key --secret write-the-secret-key
- serverless create --template aws-nodejs --name reto-tecnico
```

## INSTALAR LIBRERIAS 
```
npm i serverless-offline
npm install aws-sdk
```

## EJECUTAR LOCALMENTE 
```
npm run start
npm install aws-sdk
```

## DEPLOY
```
serverless deploy
```

## ENDPOINTS
```
en la carpeta postman esta la colección completa  

GET localhost:3500/people/1     el numero es opcional
GET localhost:3500/planets/1    el numero es opcional
GET localhost:3500/species/1    el numero es opcional

POST localhost:3500/addpeople
POST localhost:3500/addplanets
POST localhost:3500/addspecies

POST localhost:3500/deletepeople
POST localhost:3500/deleteplanets
POST localhost:3500/deletespecies

POST localhost:3500/updatepeople
POST localhost:3500/updateplanets
POST localhost:3500/updatespecies