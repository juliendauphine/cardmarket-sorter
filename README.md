# Cardmarket Shopping Wizard Sorter

Extension Firefox qui **trie automatiquement les blocs vendeurs** de la page
"Shopping Wizard Results" de Cardmarket par **nombre de cartes décroissant**.

## Fonctionnalités

- **Tri automatique** au chargement de la page (plus de cartes → en premier)
- **Bouton de tri** pour basculer entre ordre décroissant ↓ et croissant ↑
- **Badges colorés** sur chaque carte vendeur :
  - 🟢 Vert : ≥ 10 cartes
  - 🟠 Orange : 4–9 cartes
  - ⚫ Gris : 1–3 cartes

## Installation (mode développeur)

1. Ouvrez Firefox et allez sur `about:debugging`
2. Cliquez **"Ce Firefox"** dans le menu de gauche
3. Cliquez **"Charger un module complémentaire temporaire"**
4. Naviguez vers le dossier `cardmarket-sorter/` et sélectionnez `manifest.json`
5. L'extension est active ! Elle se désactivera au redémarrage du navigateur.

## Installation permanente (Firefox Developer Edition ou Nightly)

1. Allez dans `about:config`
2. Mettez `xpinstall.signatures.required` à `false`
3. Dans `about:addons` → ⚙️ → "Installer depuis un fichier"
4. Sélectionnez le fichier `.zip` de l'extension (renommez le dossier en `.zip`)

## Utilisation

Naviguez sur une page Shopping Wizard Cardmarket :
`https://www.cardmarket.com/*/Wants/ShoppingWizard/Results/*`

Les blocs sont automatiquement triés. Cliquez le bouton **"🔢 Trié : ↓ Cartes"**
pour inverser l'ordre.
