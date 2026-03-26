# 🎬 300 films, un profil

> Coche les films que tu as vus parmi une sélection des 300 films les plus populaires et découvre ton profil de spectateur.

---

## À propos

**300 films, un profil** est une application web interactive qui te permet de :

- Parcourir une sélection de **300 films incontournables** issus du top IMDb et du top Letterboxd, couvrant les 6 dernières décennies
- Cocher les films que tu as vus
- Obtenir un **profil de spectateur personnalisé** basé sur tes choix

Aucun compte, aucun email, aucune inscription. Juste toi et le cinéma.

---

## Fonctionnalités

- **Sélection de 300 films** – Les plus populaires sur IMDb et Letterboxd des années 60 à aujourd'hui
- **Profil détaillé** avec statistiques sur :
  - Tes genres préférés
  - Les pays de cinéma que tu fréquentes
  - Tes décennies de prédilection
  - Ton réalisateur fétiche
  - Ton acteur fétiche
- **Barre de progression** en temps réel
- **Pagination** pour naviguer facilement parmi les films
- **100% local** – aucune donnée envoyée, aucun serveur

---

## Démo

👉 [Accéder au site][(https:////nate140.github.io/300-films/)]

---

## Technologies utilisées

| Technologie | Usage |
|---|---|
| HTML5 | Structure de la page |
| CSS3 | Mise en forme et animations |
| JavaScript (Vanilla) | Logique de l'application |

Aucune dépendance externe. Aucun framework. Léger et rapide.

---

## Structure du projet

```
/
├── index.html      # Structure principale (3 pages : accueil, sélection, résultats)
├── style.css       # Styles et mise en page
└── script.js       # Données des films et logique de l'application
```

---

## Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git

# Ouvrir le fichier dans un navigateur
cd VOTRE_REPO
open index.html
```

Ou simplement ouvrir `index.html` directement dans ton navigateur — aucun serveur requis.

---

## Comment ça marche ?

1. **Page d'accueil** – Clique sur *Commencer*
2. **Sélection** – Parcours les 300 films et coche ceux que tu as vus
3. **Résultats** – Découvre ton profil de spectateur avec des statistiques détaillées

---

## Source des données

La sélection de films est établie à partir de :
- [Top IMDb](https://www.imdb.com/chart/top/) – Films les mieux notés
- [Top Letterboxd](https://letterboxd.com/films/popular/) – Films les plus populaires

Couverture : **années 1960 à aujourd'hui**, sur 6 décennies.

---

## Contribution

Les suggestions sont les bienvenues ! N'hésite pas à ouvrir une [issue](https://github.com/VOTRE_USERNAME/VOTRE_REPO/issues) pour :
- Signaler un bug
- Proposer un film manquant
- Suggérer une nouvelle fonctionnalité

---

## Licence

Ce projet est sous licence [MIT](LICENSE).

