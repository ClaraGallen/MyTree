/* global d3, FamilyTree, data, setData*/

import React, { useEffect, useState } from 'react';
import "./styles/Tree.css";
import "./styles/MainTree.css";
import plus from "./img/plus.png";
import plusG from "./img/plusG.png";
import pointer from "./img/pointer.png";
import pointerG from "./img/pointerG.png";
import info from "./img/info.png";
import infoG from "./img/infoG.png";
import axios from 'axios';


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

    // console.log("début avec : " + parentId);
    
    
    while (list_member.length !== 0){

        try {
            const response = await axios.get(`/people/${list_member[0]}`);
            // console.log(response.data._id);

            var dateNaissance = "?";
            var dateDeces = "?";
    
            if (response.data.dateNaissance != null) {
                dateNaissance = new Date(response.data.dateNaissance);
                var jourNaissance = dateNaissance.getDate();
                var moisNaissance = dateNaissance.getMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
                var anneeNaissance = dateNaissance.getFullYear();
                dateNaissance = `${jourNaissance}/${moisNaissance}/${anneeNaissance}`;
            }
            
            if (response.data.dateDeces != null) {
                dateDeces = new Date(response.data.dateDeces);
                var jourDeces = dateDeces.getDate();
                var moisDeces = dateDeces.getMonth() + 1; // Les mois commencent à 0, donc on ajoute 1
                var anneeDeces = dateDeces.getFullYear();
                dateDeces = `${jourDeces}/${moisDeces}/${anneeDeces}`;
            }
        
            const parent = {
            id: response.data._id,
            name: response.data.prenom + " " + response.data.nom,
            birthyear: dateNaissance,
            deathyear: dateDeces, 
            children: [],
            parents: [],
            sexe: response.data.sexe,
            own_unions: [],

            
            // Ajouter les autres infos
            
            
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
                if ("pere" in response.data.parents) {
                    const pereValue = response.data.parents.pere;
                    if (!list_member.includes(pereValue) && !list_member_add.includes(pereValue)) {
                        list_member.push(pereValue)};
                        parent.parents.push(pereValue);
    
                }
                if ("mere" in response.data.parents) {
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
        }

    };

    // console.log(persons);
    // console.log(unions);
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
    const [tooltipData, setTooltipData] = useState(null);
    const [datas, setDatas] = useState(null);


    useEffect(() => {

        const fetchData = async () => {
            const formattedData = await formatData();
            setDatas(formattedData);
            setData(formattedData);
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        if (datas) {
            const svg = d3.select("#tree-here").append("svg")
                .attr("width", document.body.offsetWidth)
                .attr("height", document.documentElement.clientHeight);
            
            let FT = new FamilyTree(data, svg);
            FT.draw();
    
            // Clean up SVG before unmounting the component
            return () => {
                svg.selectAll("*").remove();
            };
        }
    }, [datas]);
    

    useEffect(() => {
        localStorage.setItem('selectedIcon', "pointer");
        changeIcon();
    }, []);


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
                default:
                    return "";
            }
        };

        // Code pour mettre à jour l'affichage des icônes lorsque selectedIcon change
        const iconContainer = document.getElementById("icon-here");
        if (iconContainer) {
            iconContainer.innerHTML = "";
            const icons = ["pointer", "info", "plus"];
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


    // Fonction de gestion d'un clic sur un nœud de l'arbre
    const handleNodeClick = (event) => {
        click();
        const selectedIcon = localStorage.getItem('selectedIcon');
    
        if (selectedIcon === "info") {
            let id_tmp = localStorage.getItem('id_tmp');
            const personData = datas.persons[id_tmp];
    
            setTooltipData({
                name: personData.name,
                birthday: personData.birthyear,
                deathday: personData.deathyear,
                position: {
                    left: event.pageX + 10, // Ajoute un décalage de 10px à droite
                    top: event.pageY - 10 // Ajoute un décalage de 10px vers le haut
                }
            });
        };
    };

    const click = () => {
        console.log("La fonction click() est appelée");
        // appelle la fonction click définie dans familytree.js
    };
    
    return (
        <div>
            <div id="tree-here" onClick={handleNodeClick}></div>
            <div className="icon-container" id="icon-here" onClick={changeIcon}></div>
            {tooltipData && (
                <div className="tooltip" style={{ left: tooltipData.position.left, top: tooltipData.position.top }}>
                    <p>Nom: {tooltipData.name}</p>
                    <p>Né le: {tooltipData.birthday}</p>
                    <p>Mort le: {tooltipData.deathday}</p>
                    <button onClick={() => setTooltipData(null)}>Fermer</button>
                </div>
            )}
        </div>
    );
};
