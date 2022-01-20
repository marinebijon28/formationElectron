### formation electron udemy

## section 2 : culture et pré-requis

# Qu'est-ce que NodeJS ?
NodeJs est basé sur le langage JavaScript. C'est un langage bas niveau et orienté serveur. Tu peux le constaté, on peut aussi du javascript côté serveur. On va rapidement faire historique ensemble.

# historique
Le JavaScript a été crée en 1995 dans le but de dynamiser les pages HTML qu'on appelais à l'époque DHTML. D pour dynamique. Dans les années 2000 je JavaScript a connu un énorme gap. L'évolution est dûe à jQuery qui a permis en autre la création d'interface graphique et d'animation. En 2010, Google Chrome lance son nouveau moteur d'exécution JavaScript qui est nommé v8, qui a permis une évolution énorme l'exécution du JavaScript. Qui a ainsi mis en lumière un fabuleux langage et aussi l'apparaition d'un nombreux Framework dont météore, blackbon, ou encore le très connus Agnular.

# nodeJS
La grande différence va résider dans le fait que nodeJS permet d'exécuter du JavaScript côté serveur ce qui jusqu'a présent été totalement impossible. NodeJS est ni Framework, ni une libraie. C'est un environnement très bas niveau. Si on devait le comparer le JavaScript serait beaucoup plus du C que du PHP en terme de langage serveur. Son utilisation, elle est assez spécifique. Elle est différente du langage commun parce que tout comme le JavaScript, le nodeJS est basé sur les événements et c'est grâce à cela qu'il excel dans certains domaines les chats, les uploads rapides, ou encore les requêtes API. Finallement qui utilise le nodeJS pour tout ou parti de son application. ona va retrouver de très grosse société comme : Netflix, trello, paypal ou encore LinkedIn et Uber. On va retrouver d'autres société en dehors de l'IT (information Technology) par exemple Walmart

# pourquoi le nodeJS
Alors, pourquoi utilise-t'on nodeJS comme j'ai pu te le dire dans l'introduction, c'est pour sa rapidité d'exécution grâce au moteur d'exécution v8. 
On a des performances qui sont très élévées avec un système d'événement non bloquant, on reviendra sur ce terme non bloquant. 
Sa force notamment aujourd'hui c'est qu'un développeur JavaScript. Il saura débugger un backend nodeJS. Il pourra aussi savoir développer et débugger un front-end React, Angular ou autre framework JavaScript. On peut dire facilement qu'il est fullstack et c'est un énorme avantage en entreprise. 
Enfin le dernier point qu'on pourrait citer c'est une technologie stable et éprouvée qui est supporter par des gens de l'IT aujourd'hui.

# moteur v8
Comme je le disais le moteur d'exécution v8 est l'un des deux points qui permet a nodeJS, d'être ultra rapide et reactif. C'est outil le moteur est open source, créée par Google pour analyser et utiliser Google très rapidement.
Comment cela fonctionne est bah cela est très simple, les anciens navigateurs interprété par JavaScript de manière non optimal souvent au fur a mesure ce qui mettait beaucoup trop de de temps pour le transformer en code machine. Aujourd'hui le moteur v8 utilise la compilation JIT qui signifie just in time. Qui transforme de manière ultra rapide et instané le code en code machine.
Le deuxième point qui rends le code machine ultra rapide c'est ça façon de fonctionner. Je te l'ai dis en début de cours, il est basé sur un mode non bloquant et événementiel on va prendre un exemple pour illustrer tous ça. 
Imaginons que l'on veut uploader un fichier d'un giga, si on utilise un PHP côté serveur du langage PHP. Le programme va attendre de recevoir l'intégralité du fichier. Puis va le traité et effectué des nouvelles informations pendant tous ce laps de temps le serveur est occupé et ne peux rien faire. Il ne peut pas répondre aux requêtes. On le voit encore sur certains sites et les utilisateurs pensent qu'il est buggué car il ne réponds plus. C'est en fait le PHP qui utilise  un modèle dit bloquant des exécutions des tâches. 

# serveur nodeJS
Maintenant on va prendre l'utilisation d'un serveur nodeJS est bien le serveur va recevoir une notification d'uploads et tant donnée qu'il fonctionne avec des événements nodeJS va simplement attendre la notification de la fin d'upload pour faire les mêmes actions qu'un serveur PHP sur le fichier. La différence réside que le serveur ne sera pas occupée. Cela veut dire que l'utilisateur pourra faire autre chose tant que le fichier n'est pas uploader entièrement. Le serveur nodeJS peut répondre à l'intégralité des requêtes en attendant que l'upload soit terminer.

# comment fonctionne ce modèle non bloquant
Il repose sur des notions de callback ou en français la fonction de rappel. Ce sont des fonctions qui prennent en paramètres d'autres fonctions qui vont permettre d'exécuter du code uniquement lorsque la fonction précédente à terminer.
Dans notre exemple précédent on aurait une fonction callback une fois le fichier reçus. Par analogie on va imaginer que tu fasses cuire des pâtes. La fonction callback serait dès que les pâtes sont cuites. Donc l'événement ici, c'est la cuisson des pâtes. Tu vas les égouter. Tu auras donc la passoire et quand l'événement de la cuisson sera bonne pour les pâtes sera déclencher on exxécutera la tâche que tu as déjà préparer ce sera déclenché. Tu exécuteras la tâche que tu avais déjà préparé ce sera d'égouter les pâtes. Tu vois un petit peu le mécanisme. Pour bien que tu comprennnes.
Le gros avantage du système non bloquant, c'est qu'on va paralléliser les tâches.
Vue qu'on fait tout en background. On fait tout en arrière plan, on peut avoir un tâche qu'en parallèle. Tandis qu'avec nodeJS avec son système événementiel non bloquant. On peut paralléliser les tâches. L'inconvénient que tu peux voir c'est que s'il y a beaucoup d'upload instantané faudra forcément un très gros serveur avec un système non bloquant.
En tout cas je penses que tu peux comprendre que le nodeJS est plutôt pas mal. Allez je te retrouve dans la suite du cours à tout de suite.