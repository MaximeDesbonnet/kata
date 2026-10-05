# Gilded Rose

Le kata [Gilded Rose](https://github.com/emilybache/GildedRose-Refactoring-Kata) en TypeScript : refactorer un code
hérité sans en changer le comportement, puis ajouter les articles « Conjured ».
Règles métier : [GildedRoseRequirements_fr.md](GildedRoseRequirements_fr.md).

## Démarrer

```sh
npm install
npm test                      # tests unitaires + golden master (Vitest)
npm run typecheck             # vérification des types
npm run test:coverage         # couverture
npm run golden-master -- 10   # inventaire de référence sur 10 jours
```

## Démarche

L'historique des commits se lit dans l'ordre, chaque étape laisse les tests au vert :

1. **Importer le code d'origine** tel quel, pour que chaque changement soit visible dans un diff.
2. **Figer le comportement avant de toucher au code** : un test par règle de la spécification (bornes 0 et 50, date
   dépassée, paliers des Backstage passes…) et un golden master de 30 jours en snapshot. Couverture : 100 % des
   lignes et des branches.
3. **Un seul outil de test** : le kata en livrait trois, dont les types se contredisaient (`tsc` échouait).
4. **Refactorer par petits pas** : extraire la mise à jour d'un article, puis une règle par type d'article, choisie
   d'après le nom. Les bornes de qualité sont centralisées dans `changeQuality`.
5. **Ajouter Conjured en TDD** : tests vus rouges, puis le code. Le snapshot du golden master change seulement sur
   les lignes du « Conjured Mana Cake ».

## Choix et limites

- **La classe `Item` n'est pas touchée**, comme l'exige l'énoncé (le gobelin).
- **Une qualité déjà hors bornes n'est pas corrigée** (60 reste au-dessus de 50 en baissant d'un point). C'est le
  comportement du code d'origine, découvert pendant le refactoring et figé par un test : le changer est une décision
  métier, pas un refactoring.
- **Un article est Conjured si son nom commence par « Conjured »**. Un « Conjured Aged Brie » n'est pas prévu :
  l'énoncé ne dit pas comment combiner les règles.
- **Des fonctions plutôt que des classes** pour les règles : chaque règle tient en quelques lignes, une hiérarchie de
  classes n'apporterait rien ici. Si les règles se multipliaient, l'aiguillage `ruleFor` deviendrait une table
  nom → règle.
