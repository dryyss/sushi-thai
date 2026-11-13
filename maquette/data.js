/* Carte de la maquette : rubriques, plats, prix en euros, options. */
const eur=n=>n.toFixed(2).replace('.',',')+' €';
const VIANDE={name:'Viande au choix',type:'one',choices:[{n:'Poulet'},{n:'Bœuf'},{n:'Crevettes'},{n:'Végétarien'}]};
const PLATS=['Khao pad','Pad krapao','Pad thaï','Sel et poivre','Poulet ou bœuf thaï','Curry rouge','Curry vert','Poulet caramel','Riz cantonais','Wok composé'];
const MENU=[
 {id:'formules',name:'Formules',sub:'Le bon plan pour un repas complet.',items:[
  {n:'Formule Pattaya',p:13.9,d:'1 wok ou plat thaï (hors signature), 2 nems ou 2 brochettes yakitori ou 2 crevettes tempura, 1 boisson 33 cl.',ic:'bowl',opts:[
    {name:'Ton plat',type:'one',choices:PLATS.map(n=>({n}))},
    {name:'Accompagnement',type:'one',choices:[{n:'2 nems poulet'},{n:'2 nems crevette'},{n:'2 brochettes yakitori'},{n:'2 crevettes tempura'}]},
    {name:'Boisson 33 cl',type:'one',choices:[{n:'Coca-Cola'},{n:'Coca-Cola zéro'},{n:'Ice Tea'},{n:'Oasis'}]},
    {name:'Dessert',type:'one',opt:true,choices:[{n:'Mochi',p:3},{n:'Nems chocolat',p:3},{n:'Tiramisu',p:3},{n:'Boule de coco',p:3}]}]},
  {n:'Menu enfant',p:7.9,d:'Mini riz thaï cantonais ou 3 fingers de poulet, 1 jus et 1 compote.',ic:'kid',opts:[
    {name:'Le plat',type:'one',choices:[{n:'Mini riz thaï cantonais'},{n:'3 fingers de poulet'}]}]},
  {n:'Mix Thaï',p:7.9,pcs:'8 pièces',d:'2 nems poulet, 2 tempura, 1 brochette de poulet thaï, 3 gyozas.',ic:'mix'}]},
 {id:'wok',name:'Compose ton wok',tag:'10<sup>€</sup>',sub:'Ton wok, comme tu l’aimes.',wok:true},
 {id:'thai',name:'Plats thaï',tag:'10<sup>€90</sup>',sub:'',choice:['Poulet','Bœuf','Crevettes','Végétarien'],items:[
  {n:'Khao pad',p:10.9,d:'Riz sauté aux œufs, petits pois, carottes, oignons, riz thaï.',ic:'rice',opts:[VIANDE]},
  {n:'Pad krapao',p:10.9,d:'Sauté au basilic, poivrons, oignons, riz thaï.',ic:'bowl',opts:[VIANDE]},
  {n:'Pad kapao',p:10.9,d:'Sauté de bœuf aux oignons, riz thaï.',ic:'bowl'},
  {n:'Pad thaï',p:10.9,d:'Nouilles sautées aux œufs et soja, poivrons, carottes, oignons.',ic:'noodle',opts:[VIANDE]},
  {n:'Sel et poivre',p:10.9,d:'Riz thaï, crevettes ou poulet pané.',ic:'bowl',opts:[{name:'Au choix',type:'one',choices:[{n:'Poulet'},{n:'Crevettes'}]}]},
  {n:'Poulet ou bœuf thaï',p:10.9,d:'Riz thaï, poivrons, oignons, champignons noirs, sauce thaï.',ic:'bowl',opts:[{name:'Au choix',type:'one',choices:[{n:'Poulet'},{n:'Bœuf'}]}]},
  {n:'Curry rouge',p:10.9,d:'Lait de coco, poivrons, tomates cerises, cœur de bambou, oignons.',ic:'curry',opts:[VIANDE]},
  {n:'Curry vert',p:10.9,d:'Lait de coco, poivrons, tomates cerises, cœur de bambou, courgette.',ic:'curry',opts:[VIANDE]},
  {n:'Poulet caramel',p:10.9,d:'Servi avec du riz.',ic:'bowl'},
  {n:'Riz cantonais',p:10.9,d:'Le classique, généreux.',ic:'rice',opts:[VIANDE]}]},
 {id:'signatures',name:'Signatures',sub:'Les plats qui ont fait la réputation de la maison.',items:[
  {n:'Bœuf loc lac',p:12.9,d:'Bœuf caramélisé, œuf, tomates, concombre, oignons rouges, ciboulette, riz thaï rouge.',ic:'bowl',b:'Signature'},
  {n:'Dynamite',p:11.9,d:'Poulet ou crevettes crunchy, concombre, oignons rouges, ciboulette, riz thaï rouge.',ic:'bowl',b:'Signature',opts:[{name:'Au choix',type:'one',choices:[{n:'Poulet'},{n:'Crevettes'}]}]},
  {n:'Thaï crousty',p:11.9,d:'Poulet pané croustillant, sauce blanche maison, riz, persil, oignons frits, sauce aigre-douce ou piquante.',ic:'bowl',b:'Signature',opts:[{name:'Sauce',type:'one',choices:[{n:'Aigre-douce'},{n:'Piquante'}]}]}]},
 {id:'accomp',name:'Accompagnements',sub:'',items:[
  {n:'Nems thaï (popia tod)',p:4.9,pcs:'4 pièces',d:'Feuilles de brick farcies.',ic:'nem',opts:[{name:'Garniture',type:'one',choices:[{n:'Crevette'},{n:'Poulet'},{n:'Végétarien'}]}]},
  {n:'Raviolis vapeur',p:4.9,pcs:'4 pièces',d:'Crevette.',ic:'dumpling'},
  {n:'Ebi fry tempura',p:5.9,pcs:'4 pièces',d:'Crevettes façon tempura, sauce spicy.',ic:'nem'},
  {n:'Fingers',p:4.9,pcs:'5 pièces',d:'Poulet.',ic:'nem'},
  {n:'Nems cheese',p:4.9,pcs:'4 pièces',d:'Crevette, poulet ou dinde et cheese.',ic:'nem',b:'Nouveau',opts:[{name:'Garniture',type:'one',choices:[{n:'Crevette'},{n:'Poulet'},{n:'Dinde'}]}]},
  {n:'Dynamite',p:6.9,pcs:'6 pièces',d:'Crevettes ou poulet.',ic:'bowl',b:'Nouveau',opts:[{name:'Au choix',type:'one',choices:[{n:'Crevettes'},{n:'Poulet'}]}]}]},
 {id:'sushi',name:'Sushis et poke',todo:true},
 {id:'desserts',name:'Desserts',sub:'',items:[
  {n:'Maki Nutella',p:4.5,pcs:'6 pièces',d:'Coco ou mangue.',ic:'dessert',opts:[{name:'Parfum',type:'one',choices:[{n:'Coco'},{n:'Mangue'}]}]},
  {n:'Nems chocolat',p:3.9,d:'Croustillants, cœur fondant.',ic:'nem'},
  {n:'Fondant chocolat',p:3.9,d:'',ic:'dessert'},
  {n:'Tiramisu',p:3.9,d:'Parfum à demander.',ic:'dessert'},
  {n:'Mango sticky rice',p:5.9,d:'Riz gluant, mangue fraîche, lait de coco.',ic:'dessert'},
  {n:'Mangue fraîche',p:4,d:'',ic:'dessert'},
  {n:'Litchi',p:3.9,d:'',ic:'dessert'},
  {n:'Boule de coco',p:3.9,pcs:'2 pièces',d:'',ic:'dessert'},
  {n:'Mochi',p:3.9,pcs:'2 pièces',d:'Parfums à demander.',ic:'dessert',soldout:true},
  {n:'Tarte au daim',p:4,d:'',ic:'dessert'}]},
 {id:'boissons',name:'Boissons',sub:'',items:[
  {n:'Smoothies',p:4.5,d:'Pinky (fraise, banane), Hawaïen (coco, ananas) ou Paradise (pomme, ananas, orange).',ic:'drink',opts:[{name:'Parfum',type:'one',choices:[{n:'Pinky'},{n:'Hawaïen'},{n:'Paradise'}]}]},
  {n:'Bubble tea',p:4.5,d:'Goûts à la demande.',ic:'drink'},
  {n:'Canette 33 cl',p:1.7,d:'',ic:'can',opts:[{name:'Boisson',type:'one',choices:[{n:'Coca-Cola'},{n:'Coca-Cola zéro'},{n:'Ice Tea'},{n:'Oasis'}]}]},
  {n:'San Pellegrino 50 cl',p:2.5,d:'',ic:'can'}]}
];
const WOK={n:'Compose ton wok',p:10,d:'',opts:[
  {name:'1. Ta base',type:'one',choices:['Riz thaï','Nouilles thaï','Pad thaï','Nouilles japonaises (udon)'].map(n=>({n}))},
  {name:'2. Ta protéine',type:'one',choices:['Poulet','Bœuf','Dinde','Crevettes','Saumon'].map(n=>({n}))},
  {name:'3. Tes légumes',type:'multi',max:3,choices:['Champignons noirs','Petits pois','Épi de maïs','Poivrons','Soja','Oignons','Carottes','Cœur de bambou','Ananas'].map(n=>({n}))},
  {name:'4. Ta sauce',type:'one',choices:['Piquante','Thaï','Saté','Curry','Soja','Crème fraîche','Aigre-douce','Caramel'].map(n=>({n}))},
  {name:'5. Ton topping',type:'one',choices:['Oignons frits','Graines de sésame','Cacahuètes','Ciboulette','Menthe','Gingembre','Coriandre'].map(n=>({n}))},
  {name:'Suppléments',type:'multi',opt:true,max:5,choices:[{n:'Viande en plus',p:1.5},{n:'Légume en plus',p:.5},{n:'Œuf',p:1},{n:'Gruyère',p:1},{n:'Assaisonnement',p:.5}]}]};
