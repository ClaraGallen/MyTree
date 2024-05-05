// transformData.jsx
import React, { useEffect } from 'react';
import "./styles/code.css";


// Fonction pour formater les données
const formatData = (response) => {
  const formattedData = [];

  // Traitement du parent
  const parentId = response._id.$oid;
  const parent = {
    id: parentId,
    name: response.prenom,
    children: [],
    partners: [],
    root: true,
    level: 0,
    parents: []
  };

  formattedData.push(parent);

  // Traitement des conjoints
  response.conjoints.forEach((conjoint) => {
    const conjointId = formattedData.length + 1;
    const conjointObj = {
      id: conjointId,
      name: conjoint.prenom,
      children: [],
      partners: [parentId],
      level: 0,
      parents: []
    };
    parent.partners.push(conjointId);
    formattedData.push(conjointObj);
  });

  // Traitement des enfants
  response.enfants.forEach((enfant) => {
    const enfantId = formattedData.length + 1;
    const enfantObj = {
      id: enfantId,
      name: enfant.prenom,
      children: [],
      partners: [],
      level: -1,
      parents: [parentId]
    };
    parent.children.push(enfantId);
    formattedData.push(enfantObj);
  });

  // Traitement du père
  if (response.pere) {
    const pereId = formattedData.length + 1;
    const pereObj = {
      id: pereId,
      name: response.pere.prenom,
      children: [parentId],
      partners: [],
      level: 1,
      parents: []
    };
    parent.parents.push(pereId);
    formattedData.push(pereObj);
  }

  // Traitement de la mère
  if (response.mere) {
    const mereId = formattedData.length + 1;
    const mereObj = {
      id: mereId,
      name: response.mere.prenom,
      children: [parentId],
      partners: [],
      level: 1,
      parents: []
    };
    parent.parents.push(mereId);
    formattedData.push(mereObj);
  }

  console.log(formattedData);
  return formattedData;
};

export default function Code() {

  var data = [];

  useEffect(() => {
  const response = {
    "_id": {
      "$oid": "662fc7def2861883fc0530db"
    },
    "nom": "blaaa",
    "prenom": "MOI",
    "sexe": "Homme",
    "dateNaissance": {
      "$date": "2000-08-05T22:00:00.000Z"
    },
    "enfants": [
      {
        "_id": {
          "$oid": "662fc7def2861883fc0530dc"
        },
        "nom": "blaaa",
        "prenom": "ENFANT 1",
        "email": "testt7@gmail.com",
        "sexe": "Homme",
        "dateNaissance": {
          "$date": "2000-08-05T22:00:00.000Z"
        },
        "tel": "+334964886"
      }
    ],
    "conjoints": [
      {
        "_id": {
          "$oid": "662fc7def2861883fc0530dd"
        },
        "nom": "blaaa",
        "prenom": "CONJOINT",
        "sexe": "Homme",
      }
    ],
    "pere": {
      "_id": {
        "$oid": "662fc7def2861883fc0530de"
      },
      "nom": "blaaa",
      "prenom": "PAPA",
      "sexe": "Homme",
    },
    "mere": {
      "_id": {
        "$oid": "662fc7def2861883fc0530df"
      },
      "nom": "blaaa",
      "prenom": "MAMAN",
      "sexe": "Homme",
    },
    "__v": 0
  };

  // Appel de la fonction pour formater les données
  data = formatData(response);
}, []);

useEffect(() => {
  let elements = [];
    let root, levels = [], levelMap = [],
      tree = document.getElementById('tree'),
      startTop, startLeft, gap = 32, size = 64;
    startTop = (window.innerHeight / 2) - (size / 2);
    startLeft = (window.innerWidth / 2) - (size / 2);

    data.forEach(elem => {
      if (levels.indexOf(elem.level) < 0) { levels.push(elem.level); }
    });
    levels.sort((a, b) => a - b);

    levels.forEach(level => {
      const startAt = data.filter(person => person.level === level);
      startAt.forEach(start => {
        const person = findPerson(start.id);
        plotNode(person, 'self');
        plotParents(person);
      });

    });

    adjustNegatives();

    function plotParents(start) {
      if (!start) { return; }
      start.parents.reduce((previousId, currentId) => {
        const previousParent = findPerson(previousId),
          currentParent = findPerson(currentId);
        plotNode(currentParent, 'parents', start, start.parents.length);
        if (previousParent) { plotConnector(previousParent, currentParent, 'partners'); }
        plotConnector(start, currentParent, 'parents');
        plotParents(currentParent);
        return currentId;
      }, 0);
    }

    function plotNode(person, personType, relative, numberOfParents) {
      let node = get(person.id), relativeNode, element = {}, thisLevel, exists;
      if (node) { return; }
      node = document.createElement('div');
      node.id = person.id;
      node.classList.add('node');
      node.classList.add('asset');
      node.textContent = person.name;
      node.setAttribute('data-level', person.level);

      thisLevel = findLevel(person.level);
      if (!thisLevel) {
        thisLevel = { level: person.level, top: startTop };
        levelMap.push(thisLevel);
      }

      if (personType === 'self') {
        node.style.left = startLeft + 'px';
        node.style.top = thisLevel.top + 'px';
      } else {
        relativeNode = get(relative.id);
      }
      if (personType === 'partners') {
        node.style.left = (parseInt(relativeNode.style.left) + size + (gap * 2)) + 'px';
        node.style.top = parseInt(relativeNode.style.top) + 'px';
      }
      if (personType === 'children') {
        node.style.left = (parseInt(relativeNode.style.left) - size) + 'px';
        node.style.top = (parseInt(relativeNode.style.top) + size + gap) + 'px';
      }
      if (personType === 'parents') {
        if (numberOfParents === 1) {
          node.style.left = parseInt(relativeNode.style.left) + 'px';
          node.style.top = (parseInt(relativeNode.style.top) - gap - size) + 'px';
        } else {
          node.style.left = (parseInt(relativeNode.style.left) - size) + 'px';
          node.style.top = (parseInt(relativeNode.style.top) - gap - size) + 'px';
        }
      }
      while (exists = detectCollision(node)) {
        node.style.left = (exists.left + size + (gap * 2)) + 'px';
      }

      if (thisLevel.top > parseInt(node.style.top)) {
        updateLevel(person.level, 'top', parseInt(node.style.top));
      }

      element.id = node.id;
      element.left = parseInt(node.style.left);
      element.top = parseInt(node.style.top);
      elements.push(element);
      tree.appendChild(node);
    }

    function get(id) { return document.getElementById(id); }

    function findPerson(id) {
      const element = data.filter(elem => elem.id === id);
      return element.pop();
    }

    function findLevel(level) {
      const element = levelMap.filter(elem => elem.level === level);
      return element.pop();
    }

    function updateLevel(id, key, value) {
      levelMap.forEach(level => {
        if (level.level === id) {
          level[key] = value;
        }
      });
    }

    function detectCollision(node) {
      const element = elements.filter(elem => {
        const left = parseInt(node.style.left);
        return ((elem.left === left || (elem.left < left && left < (elem.left + size + gap))) && elem.top === parseInt(node.style.top));
      });
      return element.pop();
    }

    function adjustNegatives() {
      const allNodes = document.querySelectorAll('div.asset');
      let minTop = startTop, diff = 0;
      for (let i = 0; i < allNodes.length; i++) {
        if (parseInt(allNodes[i].style.top) < minTop) { minTop = parseInt(allNodes[i].style.top); }
      };
      if (minTop < startTop) {
        diff = Math.abs(minTop) + gap;
        for (let i = 0; i < allNodes.length; i++) {
          allNodes[i].style.top = parseInt(allNodes[i].style.top) + diff + 'px';
        };
      }
    }

    function plotConnector(source, destination, relation) {
      let connector = document.createElement('div'),
        orientation, comboId, comboIdInverse, start, stop,
        x1, y1, x2, y2, length, angle, transform, exists;
      // We do not plot a connector if already present
      comboId = source.id + '-' + destination.id;
      comboIdInverse = destination.id + '-' + source.id;
      if (document.getElementById(comboId)) { return; }
      if (document.getElementById(comboIdInverse)) { return; }

      connector.id = comboId;
      orientation = relation === 'partners' ? 'h' : 'v';
      connector.classList.add('asset');
      connector.classList.add('connector');
      connector.classList.add(orientation);
      start = get(source.id); stop = get(destination.id);
      if (relation === 'partners') {
        x1 = parseInt(start.style.left) + size; y1 = parseInt(start.style.top) + (size / 2);
        x2 = parseInt(stop.style.left); y2 = parseInt(stop.style.top);
        length = (x2 - x1) + 'px';

        connector.style.width = length;
        connector.style.left = x1 + 'px';
        connector.style.top = y1 + 'px';
        // Avoid collision moving down
        while (exists = detectConnectorCollision(connector)) {
          connector.style.top = (parseInt(exists.style.top) + 4) + 'px';
        }
      }
      if (relation === 'parents') {
        x1 = parseInt(start.style.left) + (size / 2); y1 = parseInt(start.style.top);
        x2 = parseInt(stop.style.left) + (size / 2); y2 = parseInt(stop.style.top) + (size - 2);

        length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        transform = 'rotate(' + angle + 'deg)';

        connector.style.width = length + 'px';
        connector.style.left = x1 + 'px';
        connector.style.top = y1 + 'px';
        connector.style.transform = transform;
      }
      tree.appendChild(connector);
    }

    function detectConnectorCollision(connector) {
      const connectors = [].slice.call(document.querySelectorAll('div.connector.h'));
      const element = connectors.filter(elem => ((elem.style.left === connector.style.left) && (elem.style.top === connector.style.top)));
      return element.pop();
    }
  }, []);

  return (
    <div id="tree"></div>
  );
};

