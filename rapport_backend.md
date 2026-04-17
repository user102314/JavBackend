# Rapport d'Architecture et de Fonctionnement du Backend

Ce document est un aperçu simple et clair de la manière dont votre application backend est structurée, de son fonctionnement interne et des bonnes pratiques qu'elle embarque.

---

## 1. Vue d'Ensemble
L'application est une **API REST** construite en **Java 17** avec le cadriciel **Spring Boot (3.x)**. 
Son rôle principal est de faire le pont entre l'application Frontend (qui affiche le site) et les données (Base de données et fichiers). Elle traite, sécurise, sauvegarde et redistribue l'information à la demande.

---

## 2. L'Architecture en 3 Couches
Votre backend fonctionne de manière très propre selon le standard de la programmation d'entreprise : les 3 couches séparées. Lorsqu'un utilisateur effectue une action (ex. envoyer l'image d'un sponsor), la donnée traverse l'API dans un ordre précis :

1. **La Couche Controllers (`backend.admin.controller`) : La Réception**
   C'est la porte d'entrée (les points de terminaisons type `GET`, `POST`, `PUT`, `DELETE`). Le Controller lit la requête (par exemple `POST /sponsors`), vérifie obligatoirement que les données saisies par l'utilisateur sont propres (grâce à l'annotation `@Valid`) et transmet l'ordre au Service.
2. **La Couche Services (`backend.admin.servicesimpliment`) : Le Cerveau métier**
   C'est ici qu'intervient la logique dure. Si un "Bloc" est créé avec une image, le Service va extraire cette image, utiliser un client réseau pour téléverser ce fichier vers un stockage en ligne ("Supabase"), et relier l'image ou valider les données de transfert (les "DTOs").
3. **La Couche Repositories (`backend.admin.repository`) : Le Pont vers les Données**
   Basés sur les spécifications *Spring Data JPA* et *Hibernate*, les Repositories récupèrent la demande finale du Service et se traduisent eux-mêmes en langage SQL pour insérer, mettre à jour, ou supprimer les données de la base **PostgreSQL**.

---

## 3. Les Données (Les Entités)
Il existe plusieurs grands objets gérés par l'application :
- `Admin` : La gestion légère du compte d’administration (système de Login).
- `Contact` : Centralise les demandes venant de formulaires de l'utilisateur final.
- `Block`, `Information`, `Office`, `Sponsor` : Différentes briques qui permettent au panneau d'administration de modifier du contenu sur mesure dans l'application visible.

---

## 4. Spécificités et Fonctionnalités Avancées du Système
Plusieurs mécanismes tournent en arrière-plan pour fluidifier la production :

- **Sécurité et Interception Globale des Erreurs (`ApiExceptionHandler.java`)**
  Si le code système "crashe" arbitrairement, ce garde-fou intercepte l'erreur (pour éviter d'afficher vos vulnérabilités aux visiteurs) et la traduit proprement en message lisible sous format JSON (Ex: `Erreur 500 : Erreur Inattendue` ou `Erreur 400 : Email invalide`).
- **Gestionnaire du Stockage Distant (`SupabaseStorageServiceImpl.java`)**
  Le backend ne stocke pas directement les images (qui alourdiraient le serveur). L'application utilise `OkHttp` de façon sécurisée (avec des délais maximaux établis) pour envoyer tous les médias vers les Seaux d'un projet **Supabase**. L'API ne sauvegarde dans PostgreSQL que les adresses web (URLs) des images pour les fournir aux développeurs frontend.
- **Sécurité inter-domaines (`WebConfig.java`)**
  C'est ici qu'on paramètre la liste verte CORS afin de définir quels sites Web précis peuvent techniquement interroger votre API.
- **DTOs vs Modèles**
  La base de données et l'API ne se voient jamais en direct. Les données de l'API utilisent des classes appelées `DTO` (Data Transfer Objects), munies de boucliers de validations (taille, champs vides, emails), sécurisant complètement la base.

---

## 5. Comment la lancer ?
Pour déployer et démarrer ce backend localement ou en production :
1. Renseigner vos données d'environnements (les mots de passe BDD, URL Supabase, clés de service). Elles sont lues grâce à `DotEnvLoader` et `application.properties`.
2. Lancer la tâche Maven de base :
   ```bash
   mvn clean spring-boot:run
   ```
   L'application s'initialisera par défaut sur le port serveur `9090`.
