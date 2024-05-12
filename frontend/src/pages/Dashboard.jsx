/* global d3, FamilyTree, data, setData*/

import React, { useEffect, useState } from 'react';

import "./styles/Tree.css";

import plus from "./img/plus.png";
import plusG from "./img/plusG.png";
import pointer from "./img/pointer.png";
import pointerG from "./img/pointerG.png";
import info from "./img/info.png";
import infoG from "./img/infoG.png";
import link from "./img/link.png";
import linkG from "./img/linkG.png";

import axios from 'axios';

// TreeTest.js

import { NewRelationForm } from './NewRelationForm';

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

var persons_function = async () => {

    var list_member = [];  //Liste des personnes à ajouter
    var list_member_add = []; //Liste des personnes déjà ajoutées
    var persons = {};
    var unions = {};
  
    const parentId = localStorage.getItem("personId");
    list_member.push(parentId);

    console.log(list_member);

    // console.log("début avec : " + parentId);
    
    
    while (list_member.length !== 0){

        try {
            const response = await axios.get(`/people/${list_member[0]}`);
        
            const parent = {
                id: response.data._id,
                prenom: response.data.prenom,
                nom: response.data.nom,
                birth: response.data.dateNaissance || "",
                death: response.data.dateDeces || "",
                sexe: response.data.sexe,
                children: [],
                parents: [],
                own_unions: [],
                conjoints: [],
                profession: response.data.profession || "",
                adresse: response.data.adresse || "",
                tel: response.data.tel || "",
                email: response.data.email || "",
                photo: response.data.photo || ""
            };
            

            if (response.data.enfants.length !== 0) {
                response.data.enfants.forEach(enfant => {
                    const oidValue = enfant.idEnfant;
                    if (!list_member.includes(oidValue) && !list_member_add.includes(oidValue)) {
                        list_member.push(oidValue)};
                    parent.children.push(oidValue);
            });
            };
        
            if (response.data.conjoints.length !== 0) {
                response.data.conjoints.forEach(conjoint => {
                    parent.conjoints.push(conjoint);
                    const oidValue = conjoint.idConjoint;
                    if (!list_member.includes(oidValue) && !list_member_add.includes(oidValue)) {
                        list_member.push(oidValue)};


                    var unionExists = false;
                    var union;
                    if (parent.sexe === "Homme"){
                        union = [parent.id, oidValue];
                    } else {
                        union = [oidValue, parent.id];
                    }

                    for (var key in unions) {
                        if (unions.hasOwnProperty(key)) {
                            var partners = unions[key].partner;
                            if (arraysEqual(partners, union)) {
                                unionExists = true;
                                parent.own_unions.push(unions[key].id);
                                break;
                            }
                        }
                    }
                    if (!unionExists){
                        let nb = Object.keys(unions).length + 1;
                        var name_union = "u"+ nb;
                        unions[name_union] = {"id": name_union, "partner": union, "children": []};
                        parent.own_unions.push(name_union);
                    }
                });
            };
        
            if (response.data.parents) {
                if (response.data.parents.pere) {
                    const pereValue = response.data.parents.pere;
                    if (!list_member.includes(pereValue) && !list_member_add.includes(pereValue)) {
                        list_member.push(pereValue)};
                        parent.parents.push(pereValue);

                }
                if (response.data.parents.mere) {
                    const mereValue = response.data.parents.mere;
                    if (!list_member.includes(mereValue) && !list_member_add.includes(mereValue)) {
                        list_member.push(mereValue)};
                    parent.parents.push(mereValue);
                }

                var partnerExists = false;
                const mes_parents = parent.parents;

                for (var key in unions) {
                    if (unions.hasOwnProperty(key)) {
                        var partners = unions[key].partner;
                        // Vérifier si les parents existent dans la liste des partners de l'élément de l'union
                        if (arraysEqual(partners, mes_parents)) {
                            partnerExists = true;
                            unions[key].children.push(parent.id);
                            parent.parent_union = unions[key].id;
                            break;
                        }
                    }
                }

                if (!partnerExists){
                    let nb = Object.keys(unions).length + 1;
                    var name_union = "u"+ nb;
                    unions[name_union] = {"id": name_union, "partner": parent.parents, "children": [parent.id]};
                    parent.parent_union = name_union;

                    for (let item of parent.parents) {
                        // Accéder à l'objet dans persons correspondant à l'identifiant
                        let person = persons[item];
                        // Vérifier si la personne existe dans persons
                        if (person) {
                            // Ajouter l'union à own_unions de la personne
                            person.own_unions.push(name_union);
                        }
                    }             
                };

            };
        
            list_member_add.push(parent.id);
            persons[parent.id] = parent;
            list_member.shift();
            // console.log(parent);

        } catch (error){
            console.error('Error:', error);
            localStorage.removeItem('personId');
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirection vers la page de connexion
        }

    };

    console.log(persons);
    console.log(unions);
    return {persons: persons, unions: unions};
};


var links_function = function(data_unions){
    var links = [];
    
    // Parcourir chaque élément de l'objet "unions"
    for (var unionId in data_unions) {
        var union = data_unions[unionId];
        
        // Ajouter les relations entre les partenaires et les enfants
        for (var i = 0; i < union.partner.length; i++) {
            links.push([union.partner[i], unionId]);
        }
        
        for (var j = 0; j < union.children.length; j++) {
            links.push([unionId, union.children[j]]);
        }
    }
    
    return links;
};

var formatData = async () => {
    const formattedData = {};

    var {persons: data_persons, unions: data_unions} = await persons_function();
    var data_links = links_function(data_unions);

    formattedData.start = localStorage.getItem("personId");
    formattedData.persons = data_persons;
    formattedData.unions = data_unions;
    formattedData.links = data_links;    

    console.log(formattedData);
    
    return formattedData;
  };



export default function TreeTest() {
    const [alone, setAlone] = useState(true);
    const [infoPP, setInfoPP] = useState(null);
    const [linkPP, setLinkPP] = useState(null);
    const [datas, setDatas] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(' ');



    const toggleForm = () => {
        setShowForm(!showForm);
        console.log(showForm);
    };

    
    useEffect(() => {
        const fetchData = async () => {

            localStorage.setItem('id_tmp', localStorage.getItem('personId'));

            setIsLoading(true);
            const formattedData = await formatData();
            
            setDatas(formattedData);
            setData(formattedData);
            
            // Détermine si la famille est vide ou non
            const hasFamily = (formattedData.links.length >= 1);
            setAlone(!hasFamily);
            setIsLoading(false);
        };
    
        // Appelle la fonction fetchData lors du montage du composant
        fetchData();
    }, []);
    
    
    useEffect(() => {

        if (!alone) {

            // const svgWidth = window.innerWidth * 0.95; // Définir la largeur de l'élément SVG
            // const svgHeight = window.innerHeight * 1; // Définir la hauteur de l'élément SVG
        
            const svg = d3.select("#tree-here").append("svg")
                .attr("width", document.body.offsetWidth * 0.95)
                .attr("height", document.documentElement.clientHeight * 1);
            
            let FT = new FamilyTree(data, svg);
            FT.draw();
    
            // Clean up SVG before unmounting the component
            return () => {
                svg.selectAll("*").remove();
            };
        }
    }, [alone, datas]);
    

    useEffect(() => {
        if (!isLoading)
        localStorage.setItem('selectedIcon', "pointer");
        changeIcon();
        display_statistics();
    }, [isLoading]);


    function calculateAverageChildrenPerUnion() {
        let totalChildrenCount = 0;
        let totalUnionCount = 0;
    
        Object.keys(datas.unions).forEach(unionKey => {
            const union = datas.unions[unionKey];
            totalChildrenCount += union.children.length;
            totalUnionCount++;
        });
    
        const averageChildrenPerUnion = totalChildrenCount / totalUnionCount;
        return averageChildrenPerUnion.toFixed(2);
    }
    

    function display_statistics() {

        if (datas){
            const statHereElement = document.getElementById('stat-here');
            const personsArray = Object.values(datas.persons);
            const hommesCount = personsArray.filter(person => person.sexe === 'Homme').length;
            const femmesCount = personsArray.filter(person => person.sexe === 'Femme').length;

            const totalPersons = hommesCount + femmesCount;
            const averageChildren = calculateAverageChildrenPerUnion();
        
            const statisticsElement = document.createElement('div');
            statisticsElement.classList.add('statistics-container');
            
            statisticsElement.innerHTML = `
                <h2>Statistiques de la famille</h2>
                <p>Hommes: ${hommesCount}</p>
                <p>Femmes: ${femmesCount}</p>
                <p>Total: ${totalPersons}</p>
                <p>Nombre moyen d'enfants par union: ${averageChildren}</p>
            `;
            statHereElement.appendChild(statisticsElement);
        }
    }
    

    function changeIcon() {
        // Fonction pour obtenir le chemin de l'image en fonction de l'icône
        const selectedIcon = localStorage.getItem('selectedIcon');
        const getImagePath = (icon) => {
            switch (icon) {
                case "pointer":
                    return selectedIcon === "pointer" ? pointer : pointerG;
                case "info":
                    return selectedIcon === "info" ? info : infoG;
                case "plus":
                    return selectedIcon === "plus" ? plus : plusG;
                case "link":
                    return selectedIcon === "link" ? link : linkG;
                default:
                    return "";
            }
        };

        // Code pour mettre à jour l'affichage des icônes lorsque selectedIcon change
        const iconContainer = document.getElementById("icon-here");
        if (iconContainer) {
            iconContainer.innerHTML = "";
            const icons = ["pointer", "info", "plus", "link"];
            icons.forEach(icon => {
                const img = document.createElement("img");
                img.className = "icon";
                img.src = getImagePath(icon);
                img.alt = icon;
                img.addEventListener("click", () => localStorage.setItem('selectedIcon', icon));
                iconContainer.appendChild(img);
            });
        }
    }

    // Fonction pour gérer les données lorsqu'une icône d'information est sélectionnée
    const infoPerson = (event) => {
        const personData = datas.persons[localStorage.getItem('id_tmp')];

        setInfoPP({
            id: personData.id,
            prenom: personData.prenom,
            nom: personData.nom,
            dateNaissance: personData.birth,
            dateDeces: personData.death,
            tel: personData.tel,
            adresse: personData.adresse,
            email: personData.email,
            profession: personData.profession,
            photo: personData.photo,
            position: {
                left: event.pageX + 10, // Ajoute un décalage de 10px à droite
                top: event.pageY - 10 // Ajoute un décalage de 10px vers le haut
            }
        });
    };


    // Fonction pour gérer les données lorsqu'une icône de lien est sélectionnée
    const linkPerson = (event) => {
        const personData = datas.persons[localStorage.getItem('id_tmp')];
        setLinkPP({
            prenom: personData.prenom,
            nom: personData.nom,
            photo: personData.photo,
            children: personData.children.map(child => data.persons[child]),
            parents: personData.parents.map(parent => data.persons[parent]),
            conjoints: personData.conjoints.map(conjoint => conjoint),
            position: {
                left: event.pageX + 10,
                top: event.pageY - 10
            }
        });
    };

    


    // Fonction de gestion d'un clic sur un nœud de l'arbre
    const handleNodeClick = async (event) => {
        await click();
        let id_tmp = localStorage.getItem('id_tmp');
        console.log(id_tmp);
        const selectedIcon = localStorage.getItem('selectedIcon');

        if (selectedIcon === "info") {
            infoPerson(event);
        };

        if (selectedIcon === "link") {
            linkPerson(event);
        };
    };

    const click = () => {
        console.log("La fonction click() est appelée");
        // appelle la fonction click définie dans familytree.js
    };
    

    const changePP = (e) => {
        const { name, value } = e.target;
        // Si le champ de date est modifié, formater la date au format requis
        if (name === "birthday" || name === "deathday") {
            // Mettre à jour l'état avec la date formatée
            setInfoPP(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            // Si d'autres champs sont modifiés, mettre à jour l'état directement
            setInfoPP(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const changeLink = (e, index) => {
        const { name, value } = e.target;
    
        // Vérifier le nom pour déterminer quelle propriété est mise à jour
        if (name === "union") {
            setLinkPP(prevState => ({
                ...prevState,
                conjoints: prevState.conjoints.map((conjoint, i) => {
                    if (i === index) {
                        return { ...conjoint, dateUnion: value };
                    } else {
                        return conjoint;
                    }
                })
            }));
        } else if (name === "divorce") {
            setLinkPP(prevState => ({
                ...prevState,
                conjoints: prevState.conjoints.map((conjoint, i) => {
                    if (i === index) {
                        return { ...conjoint, dateDivorce: value };
                    } else {
                        return conjoint;
                    }
                })
            }));
        }
    }
    
    


    const deleteRelation = async (idMember) => {
        console.log(idMember);
        var id = localStorage.getItem('id_tmp');
        try {
            const response = await axios.delete(`/people/deleteRelation/${id}/${idMember}`);
            // Gérer la réponse si nécessaire
            console.log("Relation supprimée avec succès :", response.data);
        } catch (error) {
            // Gérer les erreurs d'appel API
            console.error("Erreur lors de la suppression de la relation :", error);
            setError(error);
        }
    }

    const updateMember = async (idMember) => {
        // Formater la date de naissance si elle est présente
        const formattedBirthday = infoPP.dateNaissance ? new Date(infoPP.dateNaissance) : null;
        // Formater la date de décès si elle est présente
        const formattedDeathday = infoPP.dateDeces ? new Date(infoPP.dateDeces) : null;
    
        // Créer un objet contenant les données à envoyer
        const requestData = {
            ...infoPP,
            dateNaissance: formattedBirthday,
            dateDeces: formattedDeathday
        };
    
        try {
            const response = await axios.patch(`/people/updatePerson/${idMember}`, requestData);
            console.log("Membre mis à jour avec succès:", response.data);
        } catch (error) {
            console.log("Erreur pendant la mise à jour du membre:", error);
            setError(error);        
        }
    };

    const deleteMember = async () => {

        const id = localStorage.getItem('id_tmp');

        try {
            await axios.delete(`/people/deletePerson/${id}`);
            
        } catch (error) {
            console.log(error);
            setError(error);
        }        
    }
    
    const updateRelation = async (idConjoint) => {
        const person = datas.persons[localStorage.getItem('id_tmp')];

        const dateUnion = linkPP.dateUnion ? new Date(linkPP.dateUnion) : null;
        const dateSeparation = linkPP.dateSeparation ? new Date(linkPP.dateSeparation) : null;
    
        const requestData = {
            dateUnion: dateUnion,
            dateSeparation: dateSeparation,
            relation: "conjoint"
        };

        try {

            console.log(requestData);
            await deleteRelation(idConjoint);
            await axios.post(`/people/addRelationByEmail/${person.email}/${idConjoint}`, requestData);
            
        } catch (error) {
            console.log(error);
            setError(error);
        }


    }

    return (
        <div>
            
            {alone ? (
            <div id="alone">
                <div id="alone_content">
                    <h1>Vous n'avez pas encore de famille.</h1>
                    <br/>
                    {!isLoading ? (
                        <div id="alone_form"><NewRelationForm /></div>
                    ) : (
                        <>loading...</>
                    )}
                </div>
            </div>
        
                

            ) : (
                <div>
                    <div id="tree-here" onClick={handleNodeClick}></div>
                    <div className="icon-container" id="icon-here" onClick={changeIcon}></div>
                    <div  id="stat-here"></div>
                    {(infoPP || linkPP)&& (
                        <div className="tooltip" style={{ left: ((infoPP && infoPP.position.left) || (linkPP && linkPP.position.left)),
                                                        top: ((infoPP && infoPP.position.top) || (linkPP && linkPP.position.top)) }}>
                            <button onClick={() => {setInfoPP(null); setLinkPP(null)}}>X</button>
                            <br />
                            {error && <p className="error-message">{error}</p>}
                            {infoPP && infoPP.photo && <img
                                src={`/people/uploads/${infoPP.photo}`}
                                alt="personne"
                            />}
                            {linkPP && linkPP.photo && <img
                                src={`/people/uploads/${linkPP.photo}`}
                                alt="personne"
                            />}
                            <br />
                            <input
                                type="text"
                                name="prénom"
                                value={infoPP ? infoPP.prenom : linkPP.prenom}
                                onChange={changePP}
                                style={{ fontSize: "18px", marginLeft: "0px", textAlign: "center" }}
                            />
                            <br />
                            <input
                                type="text"
                                name="nom"
                                value={infoPP ? infoPP.nom : linkPP.nom}
                                onChange={changePP}
                                style={{ fontSize: "18px", textTransform: "uppercase", marginLeft: "0px", textAlign: "center" }}
                            />
                            <br />
                            <br />
                            {infoPP ? (
                                <div>
                                    Né le :
                                    <input
                                    type="date"
                                    name="dateNaissance"
                                    value={infoPP.dateNaissance ? infoPP.dateNaissance.substring(0, 10) : ""}
                                    onChange={changePP}
                                    />
                                    <br />
                                    Mort le :
                                    <input
                                    type="date"
                                    name="dateDeces"
                                    value={infoPP.dateDeces ? infoPP.dateDeces.substring(0, 10) : ""}
                                    onChange={changePP}
                                    />
                                    <br />
                                    <br />
                                    Contacts :
                                    <br />
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="adresse mail"
                                        value={infoPP.email}
                                        onChange={changePP}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        name="tel"
                                        placeholder="téléphone"
                                        value={infoPP.tel}
                                        onChange={changePP}
                                    />
                                    <br />
                                    <input
                                        type="text"
                                        name="adresse"
                                        placeholder="adresse"
                                        value={infoPP.adresse}
                                        onChange={changePP}
                                    />
                                    <br />
                                    <br />
                                    Profession :
                                    <br />
                                    <input
                                        type="text"
                                        name="profession"
                                        placeholder="profession"
                                        value={infoPP.profession}
                                        onChange={changePP}
                                    />
                                    <br />
                                    <br />
                                    <button onClick={() => updateMember(infoPP.id)}>Enregistrer</button>
                                    <button onClick={() => deleteMember(infoPP.id)}>Supprimer ce membre</button>
                                </div>
                            ) : (
                                <div>
                                    <strong>Enfants :</strong>
                                    <br />
                                    {linkPP.children.map((child, index) => (
                                        <div key={index}>
                                            <input
                                                type="text"
                                                value={child.prenom + " " + child.nom}
                                                onChange={(e) => {
                                                    const newChildren = [...linkPP.children];
                                                    newChildren[index] = e.target.value;
                                                    setLinkPP({ ...linkPP, children: newChildren });
                                                }}
                                            />
                                            <button className="action"onClick={() => {
                                                deleteRelation(child.id);
                                                const newChildren = [...linkPP.children];
                                                newChildren.splice(index, 1); // Supprime l'enfant au clic du bouton "X"
                                                setLinkPP({ ...linkPP, children: newChildren });
                                            }}>❌</button>
                                        </div>
                                    ))}
                                    <div>
                                        <strong>Parents :</strong>
                                        <br />
                                        {linkPP.parents.map((parent, index) => (
                                            <div key={index}>
                                                <input
                                                    type="text"
                                                    value={parent.prenom + " " + parent.nom}
                                                    onChange={(e) => {
                                                        const newParents = [...linkPP.parents];
                                                        newParents[index] = e.target.value;
                                                        setLinkPP({ ...linkPP, parents: newParents });
                                                    }}
                                                />
                                                <button className="action" onClick={() => {
                                                    deleteRelation(parent.id);
                                                    const newParents = [...linkPP.parents];
                                                    newParents.splice(index, 1); // Supprime le parent au clic du bouton "X"
                                                    setLinkPP({ ...linkPP, parents: newParents });
                                                }}>❌</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <strong>Conjoints :</strong>
                                        <br />
                                        {linkPP.conjoints.map((conjoint, index) => (
                                            <div key={index}>
                                                <input
                                                    type="text"
                                                    value={data.persons[conjoint.idConjoint].prenom + " " + data.persons[conjoint.idConjoint].nom}
                                                    onChange={(e) => {
                                                        const newConjoints = [...linkPP.conjoints];
                                                        newConjoints[index] = e.target.value;
                                                        setLinkPP({ ...linkPP, conjoints: newConjoints });
                                                    }}
                                                />
                                                <br />
                                                <strong>(</strong>
                                                <input
                                                    type="date"
                                                    name="union"
                                                    value={conjoint.dateUnion ? new Date(conjoint.dateUnion).toISOString().substring(0, 10) : ""} // Convertir en objet Date et puis en chaîne de caractères ISO
                                                    onChange={(e) => {
                                                        const newConjoints = [...linkPP.conjoints];
                                                        newConjoints[index] = { ...conjoint, dateUnion: e.target.value };
                                                        setLinkPP({ ...linkPP, conjoints: newConjoints });
                                                        changeLink(e, index)
                                                    }}
                                                    style={{ margin: "0px" }}
    
                                                />
                                                <strong> - </strong>
                                                <input
                                                    type="date"
                                                    name="divorce"
                                                    value={conjoint.dateSeparation ? new Date(conjoint.dateSeparation).toISOString().substring(0, 10) : ""} // Convertir en objet Date et puis en chaîne de caractères ISO
                                                    onChange={(e) => {
                                                        const newConjoints = [...linkPP.conjoints];
                                                        newConjoints[index] = { ...conjoint, dateSeparation: e.target.value };
                                                        setLinkPP({ ...linkPP, conjoints: newConjoints });
                                                        changeLink(e, link)
                                                    }}
                                                    style={{ margin: "0px" }}
                                                />
                                                <strong>)</strong>
                                                <button className="action" onClick={() => {
                                                    updateRelation(conjoint.idConjoint)                                                    
                                                }}>✅</button>
                                                <button className="action" onClick={() => {
                                                    deleteRelation(conjoint.idConjoint);
                                                    const newConjoints = [...linkPP.conjoints];
                                                    newConjoints.splice(index, 1);
                                                    setLinkPP({ ...linkPP, conjoints: newConjoints });
                                                }}>❌</button>
                                            </div>
                                        ))}
                                    </div>
                                    <br />
                                    {showForm ? (
                                        <NewRelationForm setShowForm={setShowForm}  />
                                    ) : (
                                        <div>
                                            <button onClick={toggleForm}>Nouvelle Relation</button>
                                        </div>
                                    )}
                                    <div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}    