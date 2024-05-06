/* global d3, FamilyTree, data */

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



var persons_function = async () => {

    var list_member = [];
    var list_member_add = [];
    var persons = {};
    var unions = {};
  
    const parentId = localStorage.getItem("personId");
    list_member.push(parentId);
    
    
    while (list_member.length !== 0){

        var Id = list_member[0];
        const response = await axios.get(`/people/${Id}`);
    
        var dateNaissance = new Date(response.dateNaissance.$date);
        var anneeNaissance = dateNaissance.getFullYear();
        var anneeDeces = "?";
        if (response.dateDeces !== null) {
            var dateDeces = new Date(response.dateDeces.$date);
            anneeDeces = dateDeces.getFullYear();
        }
    
        const parent = {
        id: Id,
        name: response.prenom + response.nom,
        nom: response.nom,
        birthyear: anneeNaissance,
        deathyear: anneeDeces, 
        children: [],
        parents: [],
        sexe: response.sexe,

        // Ajouter les autres infos

        
        };
        
        if (response.enfants.length !== 0) {
        response.enfants.forEach(enfant => {
            const oidValue = enfant.idEnfant;
            if (!list_member.includes(oidValue) && !list_member_add.includes(oidValue)) {
                list_member.push(oidValue)};
            parent.children.push(oidValue);
        });
        };
    
        if (response.conjoints.length !== 0) {
        response.conjoints.forEach(conjoint => {
            const oidValue = conjoint.idConjoint;
            if (!list_member.includes(oidValue) && !list_member_add.includes(oidValue)) {
                list_member.push(oidValue)};
            parent.own_unions.push(oidValue);
        });
        };
    
        if (response.parents) {
            if ("pere" in response.parents) {
                const pereValue = response.parents.pere;
                if (!list_member.includes(pereValue) && !list_member_add.includes(pereValue)) {
                    list_member.push(pereValue)};
            }
            if ("mere" in response.parents) {
                const mereValue = response.parents.mere;
                if (!list_member.includes(mereValue) && !list_member_add.includes(mereValue)) {
                    list_member.push(mereValue)};
                parent.parents.push(mereValue);
            }

            var partnerExists = false;

            for (var key in unions) {
                if (unions.hasOwnProperty(key)) {
                    var partners = unions[key].partner;
                    
                    // Vérifier si les parents existent dans la liste des partners de l'élément de l'union
                    if (partners.includes(parent.parents)) {
                        partnerExists = true;
                        unions[key].children.push(Id);
                        parent.parent_union = unions[key].id;
                        break;
                    }
                }
            }

            if (!partnerExists){
                let nb = unions.length + 1;
                var name_union = "u"+nb;
                unions[name_union] = {"id": name_union, "partner":parent.parents, "children": [Id]};
                parent.parent_union = name_union;
            }

        };

            list_member_add.push(parent.id);
            persons[Id] = parent;
            list_member.shift();
    };

    return [persons, unions];

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

    var [data_persons, data_unions] = persons_function();
    var data_links = links_function(data_unions);

    formattedData.start = localStorage.getItem("personId");
    formattedData.persons = data_persons;
    formattedData.unions = data_unions;
    formattedData.links = data_links;    
    
    return formattedData;
  };



export default function TreeTest() {
    const [tooltipData, setTooltipData] = useState(null);
    const [datas, setDatas] = useState(null);


    useEffect(() => {

        //setDatas(formatData());

        //console.log(datas);

        const svg = d3.select("#tree-here").append("svg")
            .attr("width", document.body.offsetWidth)
            .attr("height", document.documentElement.clientHeight);
      
        let FT = new FamilyTree(data, svg);  // Vérifier datas et l''insérer à la place de data
      
        FT.draw();

        // Clean up SVG before unmounting the component
        return () => {
            svg.selectAll("*").remove();
        };

    }, [datas]);


    useEffect(() => {
        localStorage.setItem('selectedIcon', "pointer");
        changeIcon();
    }, []);


    function changeIcon() {
        // Fonction pour obtenir le chemin de l'image en fonction de l'icône
        const selectedIcon = localStorage.getItem('selectedIcon');

        console.log(selectedIcon);
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
            const personData = data.persons[id_tmp];
    
            console.log(personData);
    
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
                    <button onClick={() => setTooltipData(null)}>Fermer</button>
                    <p>Nom: {tooltipData.name}</p>
                    <p>Né le: {tooltipData.birthday}</p>
                    <p>Mort le: {tooltipData.deathday}</p>
                </div>
            )}
        </div>
    );
};
