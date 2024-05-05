/* global d3, FamilyTree, data */

import React, { useEffect } from 'react';
import "./styles/Tree.css";
import "./styles/MainTree.css";
import plus from "./img/plus.png";
import plusG from "./img/plusG.png";
import pointer from "./img/pointer.png";
import pointerG from "./img/pointerG.png";
import info from "./img/info.png";
import infoG from "./img/infoG.png";


export default function TreeTest() {

    useEffect(() => {
        // Insert your tree creation script here
        const svg = d3.select("#tree-here").append("svg")
            .attr("width", document.body.offsetWidth)
            .attr("height", document.documentElement.clientHeight);
      
        let FT = new FamilyTree(data, svg);
      
        FT.draw();

        // Clean up SVG before unmounting the component
        return () => {
            svg.selectAll("*").remove();
        };

    }, []);


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
            iconContainer.innerHTML = ""; // Effacer le contenu précédent
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
    const handleNodeClick = () => {
        const selectedIcon = localStorage.getItem('selectedIcon');

        if (selectedIcon === "plus") {
            click();
        } else {
            // Faire autre chose si l'icône sélectionnée n'est pas "plus"
            console.log("L'icône sélectionnée n'est pas 'plus'");
        }
    };

    // Supposons que cette fonction click() soit définie dans le même scope ou accessible ici
    const click = () => {
        console.log("La fonction click() est appelée");
        // Insérez ici le code de votre fonction click()
    };

    return (
        <div>
            <div id="tree-here" onClick={handleNodeClick}></div>
            <div className="icon-container" id="icon-here" onClick={changeIcon}></div>
        </div>
    );
};
