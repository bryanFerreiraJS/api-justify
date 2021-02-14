# api-justify

### Cette API permet de justifier un texte.

##### À l'aide de votre outil de test d'API préféré, vous devez commencer par créer un utilisateur via la route `POST admin/user/`

Dans le corps de la requête, renseignez la clé **'email'** d'une valeur correspondante à votre adresse email.

Votre outil de test est censé vous afficher cette réponse :
```json
{
    "status": "Success",
    "statusCode": 201,
    "message": "Response code 201 (User Created. He Needs His Token Before Use The Justify Route)"
}
```

#### Une fois l'utilisateur crée avec succès, vous devrez récupérer votre JWT via la route `POST token/`

Comme lors de la création de l'utilisateur, renseignez la clé **'email'** d'une valeur correspondante à l'adresse email que vous avez utilisé au préalable dans le corps de la requête.

Votre outil de test est censé vous afficher un objet qui contiendra un JWT:
```json
{
    "status": "Success",
    "statusCode": 200,
    "message": "Response code 200 (Token Sended)",
    "token": "eyJhbGciO...n2EB62fRzo"
}
```

Ce token ne sera envoyé qu'une fois. Enregistrez-le quelque part de telle sorte à pouvoir l'utiliser par la suite.

Si vous tentez d'envoyer une nouvelle requête à la route `POST token/` on vous retournera un objet avec un message d'erreur:
```json
{
    "status": "Error",
    "statusCode": 403,
    "message": "Response code 403 (A Token Has Already Been Generated For This User. Contact The Administrator To Generate A New Token)"
}
```

Dans le cadre du test, vous pouvez utiliser le contrôleur admin pour outrepasser les règles au besoin.

##### Vous avez par exemple la possibilité de permettre la génération d'un nouveau token en cas d'oubli via la route `PATCH admin/user/token/`

Si vous renseignez l'email de l'utilisateur dans le body, on vous retournera l'objet suivant:

```json
{
    "status": "Success",
    "statusCode": 200,
    "message": "Response code 200 (User Can Request Another Token)"
}
```

Vous pourrez donc récupérer un nouveau JWT via la route `POST token/` (l'ancien JWT sera caduc, garantissant le caractère unique du JWT de l'utilisateur).

##### Vous pouvez récupérer un utilisateur via la route `GET admin/user/`

Si vous renseignez l'email de l'utilisateur à récupérer dans le body, on vous retournera un objet similaire à:

```json
{
    "status": "Success",
    "statusCode": 200,
    "message": "Response code 200 (User Found)",
    "user": {
        "_id": "60291f4aa0add313d3cf9bd3",
        "email": "test@gmail.com"
    }
}
```

##### Vous pouvez également supprimer un utilisateur via la route `DELETE admin/user/`

Si vous renseignez l'email de l'utilisateur à supprimer dans le body et qu'il existe bien en base de données, on vous retournera l'objet suivant:

```json
{
    "status": "Success",
    "statusCode": 200,
    "message": "Response code 200 (User Deleted)"
}
```

##### Maintenant qu'un token vous est attribué, vous pouvez commencer à justifier du texte via la route `POST justify/`

Le JWT devra être renseigné dans l'en-tête **'Authorization'**, précédé de la chaîne de caractères **Bearer**.
L'en-tête **'Content-Type'** de la requête doit être de type **'text/plain'**.
Dans le corps de la requête, renseignez le texte à justifier.

On vous retournera un texte justifié d'une largeur de 80 caractères.

J'ai essayé de m'approcher au maximum de la syntaxe de l'exemple fourni avec le test (Un retour chariot n'est pas pris en compte. Deux retours chariots consécutifs provoque un retour chariot sur le texte justifié).

#### Tests unitaires

Les tests unitaires ont été effectué à l'aide de Mocha, Chai et Supertest.

Après avoir installé les dépendances, vous pouvez lancer les tests depuis la racine du projet grâce à la commande **'./node_modules/.bin/mocha'**, ou simplement grâce à la commande **'mocha'** si vous l'avez déjà installé sur votre machine.
