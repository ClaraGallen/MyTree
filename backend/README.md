# Backend MyTree

Cette documentation présente les points d'accès (endpoints) disponibles pour l'application MyTree. Elle inclut des détails sur les entrées de requêtes (inputs) et les sorties attendues (outputs) pour chaque endpoint de l'API, que l'équipe frontend peut utiliser pour intégrer les services backend.

## Architecture du Backend

L'architecture du backend suit une structure modulaire et est organisée comme suit :

- **`/config`** : Contient les fichiers de configuration pour différentes parties de l'application comme la base de données, l'authentification et les variables d'environnement.
- **`/controllers`** : Logique de traitement des requêtes. Chaque contrôleur gère la logique pour un aspect spécifique de l'application (par exemple, les utilisateurs, les arbres généalogiques, etc.).
- **`/models`** : Définit les schémas de la base de données MongoDB pour différentes entités comme les utilisateurs et les relations.
- **`/routes`** : Définit les routes de l'API RESTful qui exposent les fonctionnalités du serveur.
- **`/middleware`** : Contient les fonctions middleware pour la gestion des erreurs, l'authentification, la journalisation, et d'autres tâches transversales.
- **`/utils`** : Fonctions utilitaires qui peuvent être utilisées dans différents endroits du backend pour exécuter des tâches communes.
- **`server.js`** : Le point d'entrée principal du serveur backend qui configure et lance le serveur Express.

## Authentification

### Inscription

- **Endpoint** : `POST /auth/register`
- **Description** : Enregistrer un nouvel utilisateur.
- **Entrée** :
  ```json
  {
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123",
    "nom": "Jean",
    "prenom": "Dupont",
    "sexe": "Homme",
    "photo": "urlPhoto",
    "dateNaissance": "1980-01-01",
    "dateDeces": null,
    "professions": "Menuisier",
    "adresse": "123 rue de l'Exemple",
    "tel": "0123456789"
  }
  ```
- **Sortie** :
  ```json
  {
    "message": "Utilisateur enregistré avec succès",
    "userId": "identifiantUniqueUtilisateur"
  }
  ```

### Connexion

- **Endpoint** : `POST /auth/login`
- **Description** : Authentifier un utilisateur et obtenir un token.
- **Entrée** :
  ```json
  {
    "email": "utilisateur@exemple.com",
    "password": "motdepasse123"
  }
  ```
- **Sortie** :
  ```json
  {
    "token": "jwt.token.ici",
    "userId": "identifiantUniqueUtilisateur"
  }
  ```

### Déconnexion

- **Endpoint** : `GET /auth/logout`
- **Description** : Déconnecter un utilisateur et invalider le token.
- **Entrée** : Aucune, authentification requise.

- **Sortie** :
  ```json
  {
    "message": "Utilisateur déconnecté avec succès"
  }
  ```

## Gestion des Utilisateurs (Administrateur)

### Changer de Rôle

- **Endpoint** : `PATCH /users/{userId}/role`
- **Description** : Changer le rôle d'un utilisateur.
- **Entrée** :
  ```json
  {
    "newRole": "admin"
  }
  ```
- **Sortie** :
  ```json
  {
    "message": "Rôle utilisateur mis à jour avec succès"
  }
  ```

# API Endpoints pour la gestion des personnes

## Ajouter une Personne

- **Endpoint** : `POST /people/addRelation`
- **Description** : Ajouter une nouvelle Relation à la base de données.
- **Entrée** :
  ```json
  {
    "nom": "Jean",
    "prenom": "Dupont",
    "sexe": "Homme",
    "photo": "urlPhoto",
    "dateNaissance": "1980-01-01",
    "dateDeces": null,
    "professions": "Menuisier",
    "adresse": "123 rue de l'Exemple",
    "tel": "0123456789",
    "mail": "jean.dupont@example.com",
    "informationsComplementaires": "Autres informations pertinentes ici",
    "relation": "pere/mere/conjoint",
    // si Conjoint
    "dateUnion": "2010-03-01",
    "dateSeparation": null
  }
  ```
- **Sortie** :
  ```json
  {
    "message": "Relation ajoutée avec succès",
    "personId": "identifiantUniquePersonne"
  }
  ```
  Après cette opération, si la relation ajoutée est un père ou une mère, l'utilisateur actuel qui a ajouté cette relation sera considéré comme son enfant.

## Mettre à Jour une Personne

- **Endpoint** : `PUT /people/{personId}`
- **Description** : Mettre à jour les informations d'une personne existante.
- **Entrée** :
  ```json
  {
    "nom": "Jean",
    "prenom": "Dupont modifié",
    "sexe": "Homme",
    "photo": "nouvelleUrlPhoto",
    "dateNaissance": "1980-01-01",
    "dateDeces": "2040-12-31",
    "professions": "Architecte",
    "adresse": "456 nouvelle rue de l'Exemple",
    "tel": "9876543210",
    "mail": "jean.dupont.nouveau@example.com",
    "informationsComplementaires": "Mises à jour des informations",
    "relation": "pere/mere/conjoint",
    // si Conjoint
    "dateUnion": "2010-03-01",
    "dateSeparation": null
  }
  ```
- **Sortie** :
  ```json
  {
    "message": "Informations de la personne mises à jour avec succès"
  }
  ```

## Supprimer une Personne

- **Endpoint** : `DELETE /people/{personId}`
- **Description** : Supprimer une personne de la base de données.
- **Entrée** : Aucune entrée spécifique requise, l'ID est passé dans l'URL.
- **Sortie** :
  ```json
  {
    "message": "Personne supprimée avec succès"
  }
  ```

## Gestion des Relations Familiales

### Ajouter des Relations Familiales

#### Ajouter un Parent

- **Endpoint**: `POST /people/{personId}/parents`
- **Description**: Ajoute un parent (père ou mère) à une personne existante.
- **Entrée**:
  ```json
  {
    "parentType": "pere",
    "parentId": "ObjectIdDuParent"
  }
  ```
- **Sortie**:
  ```json
  {
    "message": "Parent ajouté avec succès"
  }
  ```

#### Ajouter un Conjoint

- **Endpoint**: `POST /people/{personId}/conjoints`
- **Description**: Ajoute un conjoint à une personne existante.
- **Entrée**:
  ```json
  {
    "conjointId": "ObjectIdDuConjoint",
    "dateUnion": "2021-06-01",
    "dateSeparation": null
  }
  ```
- **Sortie**:
  ```json
  {
    "message": "Conjoint ajouté avec succès"
  }
  ```

## Importation/Exportation de Données

### Exporter l'Arbre

- **Endpoint** : `GET /export`
- **Description** : Exporter l'arbre généalogique au format JSON.
- **Entrée** : Aucune, authentification requise.
- **Sortie** : Fichier JSON de l'arbre généalogique.

### Importer l'Arbre

- **Endpoint** : `POST /import`
- **Description** : Importer un arbre généalogique à partir d'un fichier JSON.
- **Entrée** : Fichier JSON de l'arbre généalogique.
- **Sortie** :
  ```json
  {
    "message": "Arbre importé avec succès"
  }
  ```

## Statistiques

### Obtenir les Statistiques

- **Endpoint** : `GET /statistics`
- **Description** : Récupérer des statistiques sur l'arbre généalogique.
- \*\*Entrée

\*\* : Aucune, authentification requise.

- **Sortie** :
  ```json
  {
    "totalMembers": 50,
    "averageLifespan": 72
    // Autres statistiques...
  }
  ```

## Erreurs

Chaque endpoint renvoie un code d'état HTTP approprié, ainsi qu'un message d'erreur descriptif en cas d'échec de la requête. Le message d'erreur est renvoyé sous la forme d'un objet JSON, comme illustré ci-dessous :

```json
{
  "error": "Description de l'erreur"
}
```

# Structure de la Base de Données MyTree

## Collections MongoDB

### Collection `Users`

La collection `Users` contient des informations sur les utilisateurs qui peuvent se connecter et gérer les données généalogiques.

Chaque document de la collection `Users` peut contenir les champs suivants :

- **\_id** : Identifiant unique MongoDB de l'utilisateur.
- **email** : Adresse email de l'utilisateur, utilisée pour la connexion et unique dans la base de données.
- **passwordHash** : Hash du mot de passe de l'utilisateur pour une sécurité accrue.
- **role** : Rôle de l'utilisateur qui peut être par exemple 'admin' ou 'user', déterminant les niveaux d'accès.
- **status** : Indique le statut actuel de l'utilisateur :
  - `Active` : L'inscription de l'utilisateur a été approuvée par l'administrateur.
  - `Suspended` : L'utilisateur a été suspendu par l'administrateur.
- **person** : Identifiant unique MongoDB de la personne (Person) associée à l'utilisateur.
- **createdAt** : Date de création de l'utilisateur.
- **updatedAt** : Date de la dernière mise à jour de l'utilisateur.

### Collection `Persons`

La collection `Persons` stocke les enregistrements individuels de chaque personne dans l'arbre généalogique.

Chaque document de la collection `Persons` peut contenir les champs suivants :

- **\_id** : Identifiant unique MongoDB de la personne.
- **nom** : Nom de famille de la personne (obligatoire).
- **prenom** : Prénom de la personne (obligatoire).
- **sexe** : Genre de la personne, 'Homme' ou 'Femme' (obligatoire).
- **photo** : Lien vers une photo de la personne (facultatif).
- **dateNaissance** : Date de naissance de la personne (facultative).
- **dateDeces** : Date de décès de la personne (facultative).
- **professions** : Liste des professions de la personne (facultatif).
- **coordonnees** : Coordonnées comprenant l'adresse, le téléphone, l'email, etc. (facultatif).
- **informationsComplementaires** : Toute autre information supplémentaire (facultatif).
- **parents** : Objets contenant les identifiants des parents de la personne (facultatif).
- **conjoints** : Tableau d'objets contenant les identifiants des conjoints de la personne (facultatif).
- **enfants** : Tableau d'objets contenant les identifiants des enfants de la personne (facultatif).
- **createdAt** : Date de création du document.
- **updatedAt** : Date de mise à jour du document.

## Sécurité

Les mots de passe ne sont jamais stockés en clair dans la base de données. Seul le hash du mot de passe, généré à l'aide d'un algorithme de cryptage fort, est stocké dans la collection `Users`.

## Exemple de Document de la Collection `Persons`

{
"\_id": ObjectId("identifiantUniquePersonne"),
"nom": "Dupont",
"prenom": "Jean",
"sexe": "Homme",
"photo": "urlPhoto",
"dateNaissance": "1970-05-15",
"dateDeces": null,
"professions": "Menuisier",
"adresse": "123 rue de l'Exemple",
"tel": "0123456789"
"informationsComplementaires": "Informations diverses ici",
"parents": {
"pere": ObjectId("identifiantPere"),
"mere": ObjectId("identifiantMere")
},
"conjoints": [
{
"idConjoint": ObjectId("identifiantConjoint"),
"dateUnion": "1995-06-20",
"dateSeparation": "2005-04-15"
}
],
"enfants": [
{
"idEnfant": ObjectId("identifiantEnfant"),
}
]
}
