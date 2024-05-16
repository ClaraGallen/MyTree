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

## Gestion des Relations Familiales

### Ajout de Relations Familiales (Méthode 1)

- **Endpoint** : `POST /people/addRelation/{id?}`
- **Description** : Ajoute un père, une mère, un conjoint ou un enfant à une personne spécifiée par l'ID fourni ou, si aucun ID n'est fourni, à la personne actuellement connectée. Si l'ID est omis, la relation sera ajoutée à la personne actuellement connectée.
- **Paramètres** :
  - `id` (optionnel) : ID de la personne à laquelle la relation doit être ajoutée. Si non spécifié, la relation sera ajoutée à la personne actuellement connectée.
- **Entrée** :

  ```json
  {
    "email": "testt36@gmail.com",
    "relation": "pere",
    "nom": "blaaa",
    "prenom": "bou",
    "sexe": "Homme",
    "dateNaissance": "08/06/2000",
    "dateDeces": "",
    "professions": "Prof",
    "adresse": "4 avenue",
    "tel": "+334964886",
    // si Conjoint
    "dateUnion": "08/06/2000",
    "dateSeparation": "04/07/2005"
  }
  ```

- **Sortie** :

  ```json
  {
    "message": "Relation ajoutée avec succès",
    "personId": "identifiantUniquePersonne"
  }
  ```

### Ajout de Relations Familiales (Méthode 2)

- **Endpoint** : `POST /people/addRelationByEmail/:email/:id?`
- **Description** : Cette route permet d'ajouter une relation à une personne existante, identifiée par son email. Si un ID est fourni, la relation est ajoutée à la personne correspondant à cet ID. Sinon, la relation est ajoutée à la personne actuellement connectée. Cette fonctionnalité est particulièrement utile pour établir des relations familiales (père, mère, conjoint, etc.) entre des personnes déjà présentes dans la base de données.
- **Paramètres** :
  - `email` : Email de la personne qui deviendra le membre de la relation spécifiée (père, mère, conjoint, etc.).
  - `id` (optionnel) : ID de la personne à laquelle la relation doit être ajoutée. Si non spécifié, la relation est ajoutée à la personne actuellement connectée.
- **Corps de la requête** :

  ```json
  {
    "relation": "conjoint",
    // si Conjoint
    "dateUnion": "2024-01-01",
    "dateSeparation": "2025-01-01"
  }
  ```

- **Sortie** :

  ```json
  {
    "message": "Relation ajoutée avec succès",
    "personId": "identifiantUniquePersonne"
  }
  ```

### Obtenir une Relation

- **Endpoint** : `GET /people/getRelation/{id1}/{id2}`
- **Description** : Récupère les détails de la relation entre deux personnes identifiées par `id1` et `id2`. La relation est définie du point de vue de la personne `id1` par rapport à la personne `id2`. Par exemple, si la relation est "enfant", cela signifie que la personne `id1` est l'enfant de la personne `id2`.
- **Paramètres** :
  - `id1` : ID de la personne 1.
  - `id2` (optionnel) : ID de la personne 2. Si non spécifié, l'ID de la personne actuellement connectée sera utilisé.
- **Entrée** : Aucune.
- **Sortie** :
  ```json
  {
    "message": "Relation récupérée avec succès",
    "relation": {
      "id1": "identifiantUniquePersonne1",
      "id2": "identifiantUniquePersonne2",
      "relation": "type de relation"
    }
  }
  ```

### Mise à Jour d'une personne

- **Endpoint** : `PATCH /people/updatePerson/{id?}`
- **Description** : Met à jour une relation spécifique (père, mère, conjoint, ou enfant) pour une personne identifiée par l'ID.
- **Paramètres** :
  - `id` (optionnel) : ID de la personne à laquelle la relation doit être ajoutée. Si non spécifié, la relation sera ajoutée à la personne actuellement connectée.
- **Entrée** :

  ```json
  {
    "nom": "Doe",
    "prenom": "John",
    "adresse": "123 Main St"
  }
  ```

- **Sortie** :
  ```json
  {
    "message": "Personne mise à jour avec succès",
    "personId": "identifiantUniquePersonne"
  }
  ```

### Suppression de Relations Familiales

- **Endpoint** : `DELETE /people/deleteRelation/{id1}/{id2?}`
- **Description** : Supprime une relation spécifique (père, mère, conjoint, ou enfant) pour des personnes identifiées par l'ID. La relation est définie du point de vue de la personne `id1` par rapport à la personne `id2`. Par exemple, si la relation est "enfant", cela signifie que la personne `id1` est l'enfant de la personne `id2`.
- **Paramètres** :
  - `id1` : ID de la personne 1.
  - `id2` (optionnel) : ID de la personne 2. Si non spécifié, l'ID de la personne actuellement connectée sera utilisé.
- **Entrée** : Aucune.

- **Sortie** :
  ```json
  {
    "message": "Relation supprimée avec succès",
    "id1": "identifiantUniquePersonne1",
    "id2": "identifiantUniquePersonne2"
  }
  ```

### Supprimer une Personne

- **Endpoint** : `DELETE /people/deletePerson/{id}`
- **Description** : Supprime une personne de la base de données, identifiée par son ID.
- **Paramètres** :
  - `id` : ID de la personne à supprimer.
- **Entrée** : Aucune.
- **Sortie** :
  ```json
  {
    "message": "Personne supprimée avec succès",
    "personId": "identifiantUniquePersonne"
  }
  ```

## Importation/Exportation de Données

### Exporter l'info d'une personne à travers son ID

- **Endpoint** : `GET /people/{id}`
- **Description** : Exporter les informations d'une personne à travers son id.
- **Entrée** : Aucune, authentification requise.
- **Sortie** : Fichier JSON de l'arbre généalogique.

exemple de sortie:

````json
{
  "_id": "60d6c47e4094a45b0468d7c9",
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "sexe": "Homme",
  "photo": "https://example.com/photo.jpg",
  "dateNaissance": "1980-01-01T00:00:00.000Z",
  "dateDeces": null,
  "professions": "Ingénieur",
  "adresse": "123 Rue de Paris, Paris, France",
  "tel": "+33123456789",
  "informationsComplementaires": {
    "hobbies": "Lecture, randonnée"
  },
  "parents": {
    "pere": "60d6c47e4094a45b0468d7c8",
    "mere": "60d6c47e4094a45b0468d7c7"
  },
  "conjoints": [
    {
      "idConjoint": "60d6c47e4094a45b0468d7c6",
      "dateUnion": "2005-06-30T00:00:00.000Z",
      "dateSeparation": null
    }
  ],
  "enfants": [
    {
      "idEnfant": "60d6c47e4094a45b0468d7c5"
    }
  ],
  "createdAt": "2022-01-01T00:00:00.000Z",
  "updatedAt": "2022-01-01T00:00:00.000Z"
}```

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
````

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
- **email** : Email de la personne (obligatoire).
- **sexe** : Genre de la personne, 'Homme' ou 'Femme' (obligatoire).
- **photo** : Lien vers une photo de la personne (facultatif).
- **dateNaissance** : Date de naissance de la personne (facultative).
- **dateDeces** : Date de décès de la personne (facultative).
- **professions** : Liste des professions de la personne (facultatif).
- **coordonnees** : Coordonnées comprenant l'adresse, le téléphone, l'email, etc. (facultatif).
- **informationsComplementaires** : Toute autre information supplémentaire (facultatif).
- **parents** : Objets contenant les identifiants des parents de la personne (facultatif).
- **conjoints** : Tableau d'objets contenant les identifiants des conjoints de la personne (facultatif).
- **enfants** : [Tableau d'objets contenant les identifiants des enfants de la personne (facultatif).]
- **createdAt** : Date de création du document.
- **updatedAt** : Date de mise à jour du document.

## Sécurité

Les mots de passe ne sont jamais stockés en clair dans la base de données. Seul le hash du mot de passe, généré à l'aide d'un algorithme de cryptage fort, est stocké dans la collection `Users`.

## Exemple de Document de la Collection `Persons`

```json
{
"\_id": ObjectId("identifiantUniquePersonne"),
"nom": "Dupont",
"prenom": "Jean",
"sexe": "Homme",
"photo": "urlPhoto",
"email": "JeanDupont@gmail.com",
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
```
