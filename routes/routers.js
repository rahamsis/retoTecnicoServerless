const express = require("express");
const { getPeople, addPeople, updatePeople, deletePeople } = require("../handlers/people");
const { getPlanets, addPlanets, updatePlanets, deletePlanets } = require("../handlers/planets");
const { getSpecies, addSpecies, updateSpecies, deleteSpecies } = require("../handlers/species");

const router =  express.Router();

//Define una ruta GET en el enrutador con el patrón "/people/:numero", donde ":numero" es un marcador de posición para un valor que se captura de la URL
router.get("/people/:numero",async (req, res) =>{

    // Accede al número capturado en la ruta a través de req.params.numero
    
    const idPeople = parseInt(req.params.numero, 10);
    const response = await getPeople(idPeople);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/planets/:numero", donde ":numero" es un marcador de posición para un valor que se captura de la URL
router.get("/planets/:numero",async (req, res) =>{

    const idPlanets = parseInt(req.params.numero, 10);
    const response = await getPlanets(idPlanets);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/species/:numero", donde ":numero" es un marcador de posición para un valor que se captura de la URL
router.get("/species/:numero",async (req, res) =>{

    const idSpecies = parseInt(req.params.numero, 10);
    const response = await getSpecies(idSpecies);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/addpeople"
router.post("/addpeople",async (req, res) =>{

    const response = await addPeople(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/addplanets"
router.post("/addplanets",async (req, res) =>{

    const response = await addPlanets(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/addspecies"
router.post("/addspecies",async (req, res) =>{

    const response = await addSpecies(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/updatepeople"
router.post("/updatepeople",async (req, res) =>{

    const response = await updatePeople(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/updateplanets"
router.post("/updateplanets",async (req, res) =>{

    const response = await updatePlanets(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/updatespecies"
router.post("/updatespecies",async (req, res) =>{

    const response = await updateSpecies(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/deletepeople"
router.post("/deletepeople",async (req, res) =>{

    const response = await deletePeople(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/deleteplanets"
router.post("/deleteplanets",async (req, res) =>{

    const response = await deletePlanets(req.body);

    res.send(response.body)
});

//Define una ruta GET en el enrutador con el patrón "/deletespecies"
router.post("/deletespecies",async (req, res) =>{

    const response = await deleteSpecies(req.body);

    res.send(response.body)
});

module.exports = router;